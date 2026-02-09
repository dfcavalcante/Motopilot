from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
import enum
from app.database.connections import Base

# Tipos de usuarios
class UserRole(str, enum.Enum):
    ENGINEER = "engenheiro"
    MANAGER = "gerente"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)
    matricula = Column(String, unique=True, index=True, nullable=False)
    funcao = Column(String, nullable=False) 
    
    chat_logs = relationship("ChatLog", back_populates="user")
    
