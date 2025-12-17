from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database.connections import Base

class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50), nullable=False)   # Ex: Honda
    modelo = Column(String(100), nullable=False) # Ex: CBR 650R
    ano = Column(Integer, nullable=True)         # Ex: 2023
    
    # Onde o PDF deste manual está salvo no servidor
    # Ex: "manuals/honda_cbr650r_2023.pdf"
    manual_pdf_path = Column(String(255), nullable=True)

    # URL da imagem da moto para exibir no chat
    #imagem_url = Column(Text, nullable=True)

    # Relacionamento com o Histórico (Uma moto aparece em vários logs)
    chat_logs = relationship("ChatLog", back_populates="moto")