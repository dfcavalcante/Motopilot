from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String, index=True)
    modelo = Column(String, index=True)
    ano = Column(String)
    manual_pdf_path = Column(String, nullable=True)
    chat_logs = relationship("ChatLog", back_populates="moto")