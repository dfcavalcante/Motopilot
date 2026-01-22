from pydantic import BaseModel
from typing import Optional

# Tirei o filter para simplificar por enquanto, tava dando conflito com o endpoint de listagem

class MotoBase(BaseModel):
    '''
    Schema base com os campos comuns.
    manual_pdf_path é opcional pois pode não ter manual no início.
    '''
    marca: str
    modelo: str
    ano: int 
    manual_pdf_path: str | None = None

class MotoUpdate(BaseModel):
    '''
    Schema para atualizar uma moto existente (PATCH).
    Todos os campos são opcionais.
    '''
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None

class MotoResponse(MotoBase):
    '''
    Schema de resposta que vai para o Frontend.
    Herda de MotoBase e adiciona o ID.
    '''
    id: int

    class Config: 
        from_attributes = True