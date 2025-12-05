from sqlalchemy import Column, Integer, String, Boolean
from app.database.connections import Base

class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    chassi = Column(String(17), unique=True, index=True, nullable=False)
    marca = Column(String, index=True, nullable=False)
    modelo = Column(String, index=True, nullable=False)
    ano = Column(Integer, nullable=False)
    cor = Column(String, nullable=False)
    placa = Column(String, unique=True, index=True, nullable=False)

    #Campos para utilizar na lógica de serviço
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    has_manual = Column(Boolean, default=True, nullable=False)