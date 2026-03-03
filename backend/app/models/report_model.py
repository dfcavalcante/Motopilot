from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Report(Base):
    __tablename__ = "relatorios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Chaves Estrangeiras
    cliente_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    moto_id = Column(Integer, ForeignKey("motos.id"), nullable=False)

    # Dados do Relatório
    diagnostico = Column(Text, nullable=False)
    atividades = Column(Text, nullable=False)
    observacoes = Column(Text, nullable=True)
    mecanicos = Column(Text, nullable=False)
    pecas = Column(Text, nullable=True)

    # Auditoria
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # --- CORREÇÃO AQUI ---
    # 1. Mudamos de "Cliente" para "User" (pois é o nome da sua classe de usuários).
    # 2. Removemos 'back_populates' por enquanto para evitar erro se as outras 
    #    classes (User e Moto) ainda não tiverem o campo 'relatorios' criado.
    cliente = relationship("User")
    moto = relationship("Moto", back_populates="relatorios")

    # TODO: fotos e assinatura digital