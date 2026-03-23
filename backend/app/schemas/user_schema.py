from pydantic import BaseModel, EmailStr, field_validator
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

    @field_validator('senha')
    @classmethod
    def senha_nao_pode_ser_muito_longa(cls, v: str) -> str:
        if len(v.encode('utf-8')) > 72:
            raise ValueError('A senha não pode ter mais de 72 caracteres.')
        return v


class UserPublic(BaseModel):
    nome: str
    email: EmailStr
    matricula: str
    funcao: str

class UserUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    matricula: Optional[str] = None
    funcao: Optional[str] = None
    senha: Optional[str] = None

    @field_validator('senha')
    @classmethod
    def senha_nao_pode_ser_muito_longa(cls, v: Optional[str]) -> Optional[str]:
        if v and len(v.encode('utf-8')) > 72:
            raise ValueError('A senha não pode ter mais de 72 caracteres.')
        return v
    
class UserResponse(UserPublic):
    id: int
    # Não expõe senha em respostas da API
    
    class Config:
        from_attributes = True # Permite ler dados do SQLAlchemy

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserLogin(BaseModel):
    email: EmailStr
    senha: str