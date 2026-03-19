import os
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from app.models.moto_model import Moto
from app.models.report_model import Report
from app.schemas.moto_schema import MotoBase, MotoUpdate, MotoResponse, ConcluirManutencaoRequest
from typing import List, Optional
from app.services.notification_service import NotificationService
from app.models.moto_model import ModeloMoto
from app.schemas.moto_schema import ModeloMotoBase

class Moto_service:
    def criar_moto(self, db: Session, moto_data: MotoBase) -> MotoResponse:
        """
        Cria uma moto validando se o ModeloMoto existe.
        """
        # 1. Validar se o ModeloMoto existe
        modelo_moto = db.scalars(
            select(ModeloMoto).where(ModeloMoto.id == moto_data.modelo_moto_id)
        ).first()
        
        if not modelo_moto:
            raise ValueError(f"Modelo de moto com ID {moto_data.modelo_moto_id} não encontrado.")
        
        # 2. Criar a moto
        db_moto = Moto(**moto_data.model_dump()) 
        
        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)
        NotificationService(db).notificar_moto("criada", db_moto.id, modelo_moto.marca, modelo_moto.modelo)
        return db_moto
    

    #Esse aqui é o sem filtro
    def listar_motos(self, db: Session) -> List[Moto]: 
        stmt = select(Moto).options(joinedload(Moto.modelo_moto))
        return list(db.scalars(stmt).all())

    def buscar_moto_por_id(self, db: Session, id: int) -> Optional[Moto]:
        return db.scalars(select(Moto).where(Moto.id == id)).first()

    #Deleta a moto e seu manual associado
    def deletar_moto(self, db: Session, id: int) -> bool:
        db_moto = db.scalars(select(Moto).where(Moto.id == id)).first()

        if not db_moto:
            return False
        
        nome_arquivo = db_moto.manual_pdf_path
        caminho_arquivo = os.path.join(os.getcwd(), nome_arquivo) if nome_arquivo else None

        if nome_arquivo and caminho_arquivo and os.path.exists(caminho_arquivo):
            os.remove(caminho_arquivo)
        
        db.delete(db_moto)
        db.commit()
        
        # Obter dados do modelo para notificação
        modelo_moto = self.buscar_moto_por_id(db, db_moto.moto_id)
        if modelo_moto:
            NotificationService(db).notificar_moto("deletada", id, modelo_moto.marca, modelo_moto.modelo)
        return True

    def atualizar_moto(self, db: Session, id: int, moto_data: MotoUpdate) -> Optional[MotoResponse]:
        db_moto = db.scalars(select(Moto).where(Moto.id == id)).first()

        if not db_moto:
            return None
        
        moto_dict = moto_data.model_dump(exclude_unset=True)
        for key, value in moto_dict.items():
            setattr(db_moto, key, value)

        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)
        
        # Obter dados do modelo para notificação
        modelo_moto = self.buscar_moto_por_id(db, db_moto.moto_id)
        if modelo_moto:
            NotificationService(db).notificar_moto("atualizada", db_moto.id, modelo_moto.marca, modelo_moto.modelo)
        return db_moto


    def arquivar_moto(self, db: Session, id: int) -> Optional[MotoResponse]:
        db_moto = db.scalars(select(Moto).where(Moto.id == id)).first()
        if not db_moto: return None

        if hasattr(db_moto, 'is_active'):
            db_moto.is_active = False 
        
        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)
        
        # Obter dados do modelo para notificação
        modelo_moto = self.buscar_moto_por_id(db, db_moto.moto_id)
        if modelo_moto:
            NotificationService(db).notificar_moto("arquivada", db_moto.id, modelo_moto.marca, modelo_moto.modelo)
        return db_moto
    
    def adicionar_manual(self, db: Session, moto_id: int, file_path: str) -> Optional[MotoResponse]:
        """Adiciona um manual PDF a uma moto existente."""
        db_moto = db.scalars(select(Moto).where(Moto.id == moto_id)).first()
        
        if not db_moto:
            return None
        
        db_moto.manual_pdf_path = file_path
        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)
        
        # Obter dados do modelo para notificação
        modelo_moto = self.buscar_moto_por_id(db, db_moto.moto_id)
        if modelo_moto:
            NotificationService(db).notificar_moto("manual adicionado", db_moto.id, modelo_moto.marca, modelo_moto.modelo)
        return db_moto

    def concluir_manutencao(self, db: Session, moto_id: int, dados: ConcluirManutencaoRequest) -> dict:
        """
        Conclui a manutenção de uma moto e gera o relatório na mesma transação.
        Se qualquer etapa falhar, tudo é revertido (rollback automático).
        
        Retorna um dict com a moto atualizada e o relatório criado.
        """
        # 1. Buscar a moto
        db_moto = db.scalars(select(Moto).where(Moto.id == moto_id)).first()
        if not db_moto:
            raise ValueError(f"Moto com ID {moto_id} não encontrada.")
        
        if db_moto.estado == "Concluída":
            raise ValueError("Esta moto já foi concluída.")

        try:
            # 2. Alterar status para "Concluída"
            db_moto.estado = "Concluída"

            novo_relatorio = Report(
                moto_id=moto_id,
                cliente_id=dados.cliente_id,
                diagnostico=dados.diagnostico,
                mecanicos=dados.mecanicos,
                atividades=dados.atividades,
                pecas=", ".join(dados.pecas) if dados.pecas else None,
                observacoes=dados.observacoes,
            )
            db.add(novo_relatorio)

            # 4. Commit atômico — moto + relatório salvos juntos
            db.commit()
            db.refresh(db_moto)
            db.refresh(novo_relatorio)

            return {"moto": db_moto, "relatorio": novo_relatorio}

        except Exception as e:
            db.rollback()
            raise e
    
    def verificar_numero_serie_existente(self, db: Session, numero_serie: str) -> bool:
        """Verifica se um número de série já existe no banco de dados. Verificação pro frontend"""
        moto_existente = db.scalars(
            select(Moto).where(Moto.numero_serie == numero_serie)
        ).first()
        return moto_existente is not None
    
    def graficos_motos(self, db: Session):
        """Retorna contagem de motos agrupadas por estado para gráficos no frontend."""
        COLORS = {
            "Disponível": "#00C49F",
            "Em Manutenção": "#FFBB28",
            "Concluída": "#0088FE",
        }
        results = db.execute(
            select(Moto.estado, func.count(Moto.id).label("total"))
            .group_by(Moto.estado)
        ).all()
        return [
            {
                "name": r.estado or "Sem estado",
                "value": r.total,
                "color": COLORS.get(r.estado, "#8884d8"),
            }
            for r in results
        ]
