from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connections import Base

class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String, index=True)  # Ex: Honda, Yamaha
    modelo = Column(String, index=True) # Ex: CB 500
    ano = Column(Integer)
    placa = Column(String, unique=True, nullable=True) # Placa única
    
    # Exemplo de Relacionamento (Chave Estrangeira):
    # Se você quiser vincular uma moto a um dono (User), faria assim:
    # owner_id = Column(Integer, ForeignKey("users.id"))
    # owner = relationship("User", back_populates="motos")