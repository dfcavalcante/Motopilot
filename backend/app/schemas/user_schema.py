from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

# Define as opções aceitas no JSON
class RoleEnum(str, Enum):
    ENGINEER = "engenheiro"
    MANAGER = "gerente"

class UserBase(BaseModel):
    nome: str
    email: EmailStr
    cargo: RoleEnum = RoleEnum.ENGINEER # Padrão é engenheiro

class UserCreate(UserBase):
    senha: str # Senha é obrigatória só na criação

class UserResponse(UserBase):
    id: int
    # Note que NÃO devolvemos a senha aqui
    
    class Config:
        from_attributes = True # Permite ler dados do SQLAlchemy