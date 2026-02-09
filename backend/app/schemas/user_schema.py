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
    matricula: str
    funcao: str
    senha: str

class UserUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    matricula: Optional[str] = None
    funcao: Optional[str] = None
    senha: Optional[str] = None
    
class UserResponse(UserBase):
    id: int
    # Note que NÃO devolvemos a senha aqui
    
    class Config:
        from_attributes = True # Permite ler dados do SQLAlchemy

class Token(BaseModel):
    #Precisa do token dps do login ser bem sucedido
    acess_token: str

class UserLogin(BaseModel):
    email: EmailStr
    senha: str
    #acho que nao precisa verificar o cargo no login, apenas no registro já basta eu acho