import os
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from app.models.moto_model import Moto
from app.models.user_model import User
from app.models.report_model import Report
from app.models.chat_model import ChatLog
from app.schemas.moto_schema import MotoBase, MotoUpdate, MotoResponse, ConcluirManutencaoRequest
from typing import List, Optional
from app.services.notification_service import NotificationService
from app.models.moto_model import ModeloMoto
from app.schemas.moto_schema import ModeloMotoBase
import unicodedata

class Moto_pai_service:
     #Criar a moto que vai ser "referencia" as outras motos
    def criar_modelo_moto(self, db: Session, modelo_data: ModeloMotoBase) -> ModeloMotoBase:
        db_modelo = ModeloMoto(**modelo_data.model_dump())
        
        db.add(db_modelo)
        db.commit()
        db.refresh(db_modelo)
        return db_modelo
    
    def buscar_moto_pai_moto(self, db: Session, marca: str, modelo: str, ano: int) -> Optional[ModeloMoto]:
        return db.scalars(select(ModeloMoto).where(ModeloMoto.marca == marca, ModeloMoto.modelo == modelo, ModeloMoto.ano == ano)).first()

    def buscar_modelo_moto_por_id(self, db: Session, id: int) -> Optional[ModeloMoto]:      
        """Busca um ModeloMoto pelo ID."""
        return db.scalars(select(ModeloMoto).where(ModeloMoto.id == id)).first()

    def deletar_modelo_moto_com_filhas(self, db: Session, modelo_id: int) -> bool:
        """Deleta um modelo e todas as motos filhas associadas (com dependências)."""
        modelo = db.scalars(select(ModeloMoto).where(ModeloMoto.id == modelo_id)).first()
        if not modelo:
            return False

        motos_filhas = list(db.scalars(select(Moto).where(Moto.modelo_moto_id == modelo_id)).all())
        moto_ids = [m.id for m in motos_filhas]

        # Remove arquivos físicos das motos filhas, se existirem.
        for moto in motos_filhas:
            for nome_arquivo in [moto.manual_pdf_path, moto.imagem_path]:
                if not nome_arquivo:
                    continue
                caminho_arquivo = os.path.join(os.getcwd(), nome_arquivo)
                if os.path.exists(caminho_arquivo):
                    os.remove(caminho_arquivo)

        # Remove arquivos físicos do modelo, se existirem.
        for nome_arquivo in [modelo.manual_pdf_path, modelo.imagem_moto]:
            if not nome_arquivo:
                continue
            caminho_arquivo = os.path.join(os.getcwd(), nome_arquivo)
            if os.path.exists(caminho_arquivo):
                os.remove(caminho_arquivo)

        if moto_ids:
            db.query(Report).filter(Report.moto_id.in_(moto_ids)).delete(synchronize_session=False)
            db.query(ChatLog).filter(ChatLog.moto_id.in_(moto_ids)).delete(synchronize_session=False)
            db.query(Moto).filter(Moto.id.in_(moto_ids)).delete(synchronize_session=False)

        db.delete(modelo)
        db.commit()
        return True

    def atribuir_mecanico(self, db: Session, moto_id: int, mecanico_id: int) -> Optional[Moto]:
        moto = db.scalars(
            select(Moto).options(joinedload(Moto.modelo_moto)).where(Moto.id == moto_id)
        ).first()
        if not moto:
            return None

        mecanico = db.scalars(select(User).where(User.id == mecanico_id)).first()
        if not mecanico:
            raise ValueError("Mecânico não encontrado")

        funcao_normalizada = unicodedata.normalize("NFD", mecanico.funcao or "")
        funcao_normalizada = "".join(ch for ch in funcao_normalizada if unicodedata.category(ch) != "Mn")
        funcao_normalizada = funcao_normalizada.lower()

        if funcao_normalizada not in ["tecnico", "mecanico"]:
            raise ValueError("O usuário selecionado não possui perfil de técnico")

        moto.mecanico_id = mecanico_id
        moto.estado = "Em Manutenção"

        db.add(moto)
        db.commit()
        db.refresh(moto)

        modelo = moto.modelo_moto
        NotificationService(db).notificar_atribuicao_mecanico(
            moto_id=moto.id,
            moto_marca=getattr(modelo, "marca", "Moto"),
            moto_modelo=getattr(modelo, "modelo", str(moto.id)),
            mecanico_nome=mecanico.nome,
            mecanico_id=mecanico.id,
        )

        return moto

    # Listar os modelos de motos (MotoPai) com quantidade de instâncias
    def listar_motos_pai_motos(self, db: Session) -> List[dict]:
        """Retorna lista de ModeloMoto com a quantidade de motos instâncias de cada modelo."""
        stmt = select(ModeloMoto).order_by(ModeloMoto.marca, ModeloMoto.modelo)
        modelos = list(db.scalars(stmt).all())
        
        resultado = []
        for modelo in modelos:
            quantidade = len(modelo.motos_instancias) if modelo.motos_instancias else 0
            resultado.append({
                'id': modelo.id,
                'marca': modelo.marca,
                'modelo': modelo.modelo,
                'ano': modelo.ano,
                'imagem_moto': modelo.imagem_moto,
                'manual_pdf_path': modelo.manual_pdf_path,
                'quantidade_motos': quantidade
            })
        return resultado

