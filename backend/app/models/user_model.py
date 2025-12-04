from sqlalchemy import Column, Integer, String, Enum
import enum
from app.database.connections import Base
from sqlalchemy.orm import relationship

# Definimos as opções fixas para evitar erros de digitação (Ex: "gerente" vs "manager")
class UserRole(str, enum.Enum):
    ENGINEER = "engenheiro"
    MANAGER = "gerente"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    
    # Aqui está a mágica: definimos quem é quem
    cargo = Column(String, default=UserRole.ENGINEER) 
    
    # DICA DE OURO: Relacionamento para o Dashboard
    # Se este usuário for um Engenheiro, aqui ficarão os históricos de chat dele.
    # O Gerente vai consultar essa lista para gerar os gráficos.
    chat_sessions = relationship("ChatSession", back_populates="engineer")