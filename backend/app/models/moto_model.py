from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship

class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50), nullable=False)
    modelo = Column(String(100), nullable=False)
    ano = Column(Integer, nullable=False)
    
    numero_serie = Column(String(100), nullable=True, unique=True) 
    descricao = Column(Text, nullable=True)
    
    manual_pdf_path = Column(String(255), nullable=True)
    imagem_path = Column(String(255), nullable=True)
    estado = Column(String(50), nullable=True)

    # FK para o mecânico responsável (nullable = pode cadastrar sem atribuir)
    mecanico_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relacionamentos
    chat_logs = relationship("ChatLog", back_populates="moto")
    mecanico = relationship("User", back_populates="motos_atribuidas")
    relatorios = relationship("Report", back_populates="moto")