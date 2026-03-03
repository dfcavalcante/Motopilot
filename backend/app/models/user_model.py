from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)
    matricula = Column(String, unique=True, index=True, nullable=False)
    funcao = Column(String, nullable=False) 
    
    # --- CHAVES ESTRANGEIRAS (Obrigatórias para o erro sumir) ---
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    cargo_id = Column(Integer, ForeignKey("cargos.id"))

    # --- RELACIONAMENTOS ---
    # back_populates="usuarios" deve bater com o que está em Empresa e Cargo
    empresa = relationship("Empresa", back_populates="usuarios")
    cargo = relationship("Cargo", back_populates="usuarios")
    
    # back_populates="user" deve bater com o que está em ChatLog (singular 'user')
    chat_logs = relationship("ChatLog", back_populates="user")
    
    # Motos delegadas a este mecânico
    motos_atribuidas = relationship("Moto", back_populates="mecanico")
