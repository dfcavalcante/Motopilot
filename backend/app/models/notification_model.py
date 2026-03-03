from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    tipo_entidade = Column(String(30), nullable=False, index=True)
    id_entidade = Column(Integer, nullable=True, index=True)
    atividade = Column(String(20), nullable=False, index=True)
    titulo = Column(String(120), nullable=False)
    mensagem = Column(Text, nullable=False)
    lido = Column(Boolean, nullable=False, default=False, server_default="0", index=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
