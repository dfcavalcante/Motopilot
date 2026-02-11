from sqlalchemy import Column, Integer, String, Text
from app.database import Base
from sqlalchemy.orm import relationship

class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50), nullable=False)
    modelo = Column(String(100), nullable=False)
    ano = Column(Integer, nullable=False)
    
    # Mantive apenas o que estava no seu print, mas ajustei para o padrão do banco
    numero_serie = Column(String(100), nullable=True, unique=True) 
    descricao = Column(Text, nullable=True)
    
    manual_pdf_path = Column(String(255), nullable=True)
    imagem_path = Column(String(255), nullable=True)
    estado = Column(String(50), nullable=True)

    # Relacionamentos
    chat_logs = relationship("ChatLog", back_populates="moto")
    # Se você já tiver criado o Report, descomente a linha abaixo:
    # relatorios = relationship("Report", back_populates="moto")