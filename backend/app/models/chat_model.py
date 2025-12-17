from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connections import Base

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    
    pergunta = Column(Text, nullable=False)
    resposta_ia = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    # Chaves Estrangeiras
    user_id = Column(Integer, ForeignKey("users.id")) # Aponta para seu User
    moto_id = Column(Integer, ForeignKey("motos.id")) # Aponta para a Moto

    # Relacionamentos
    user = relationship("User", back_populates="chat_logs")
    moto = relationship("Moto", back_populates="chat_logs")