from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, String
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
    status = Column(Text, default="pendente", nullable=False) # Novo campo de status default "pendente"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    

    # Relacionamentos
    cliente = relationship("User")
    moto = relationship("Moto", back_populates="relatorios")

    # Evidências
    imagem_path = Column(String(255), nullable=True)