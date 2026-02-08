from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database.connections import Base

class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50), nullable=False)   # Ex: Honda
    modelo = Column(String(100), nullable=False) # Ex: CBR 650R
    ano = Column(Integer, nullable=True)         # Ex: 2023
    numeroSerie = Column(String(100), nullable=False, unique=True) # Ex: JH2RC4460KM100001
    descricao = Column(Text, nullable=True)     # Ex: "Moto esportiva de média cilindrada..."

    manual_pdf_path = Column(String(255), nullable=True)
    imagem_path = Column(String(255), nullable=True)
    estado = Column(String(50), nullable=True)

    # Relacionamento com o Histórico (Uma moto aparece em vários logs)
    chat_logs = relationship("ChatLog", back_populates="moto")