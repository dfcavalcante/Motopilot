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

    def buscar_moto_pai_moto(self, db: Session, marca: str, modelo: str) -> Optional[ModeloMoto]:
        return db.scalars(select(ModeloMoto).where(ModeloMoto.marca == marca, ModeloMoto.modelo == modelo)).first()

    def buscar_modelo_moto_por_id(self, db: Session, id: int) -> Optional[ModeloMoto]:      
        """Busca um ModeloMoto pelo ID."""
        return db.scalars(select(ModeloMoto).where(ModeloMoto.id == id)).first()

