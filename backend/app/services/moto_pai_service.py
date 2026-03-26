import os
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from app.models.moto_model import Moto
from app.models.user_model import User
from app.models.report_model import Report
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
    
    # Listar os modelos de motos (MotoPai)
    def listar_motos_pai_motos(self, db: Session) -> List[ModeloMoto]:
        stmt = select(ModeloMoto).order_by(ModeloMoto.marca, ModeloMoto.modelo)
        return list(db.scalars(stmt).all())

    def buscar_moto_pai_moto(self, db: Session, marca: str, modelo: str, ano: int) -> Optional[ModeloMoto]:
        return db.scalars(select(ModeloMoto).where(ModeloMoto.marca == marca, ModeloMoto.modelo == modelo, ModeloMoto.ano == ano)).first()

    def buscar_modelo_moto_por_id(self, db: Session, id: int) -> Optional[ModeloMoto]:      
        """Busca um ModeloMoto pelo ID."""
        return db.scalars(select(ModeloMoto).where(ModeloMoto.id == id)).first()

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
        )

        return moto

