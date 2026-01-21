from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connections import Base

class Report(Base):
    __tablename__ = "relatorios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    moto_id = Column(Integer, ForeignKey("motos.id"), nullable=False)

    diagnostico = Column(Text, nullable=False)
    atividades = Column(Text, nullable=False)
    observacoes = Column(Text, nullable=True)
    mecanicos = Column(Text, nullable=False)
    pecas = Column(Text, nullable=True)

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, onupdate=func.now())

    # Relacionamentos
    cliente = relationship("Cliente", back_populates="relatorios")
    moto = relationship("Moto", back_populates="relatorios")

    # TODO: fotos e assinatura digital
