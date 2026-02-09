from pydantic import BaseModel
from typing import Optional

# Schema base (campos comuns)
class MotoBase(BaseModel):
    marca: str
    modelo: str
    ano: str
    manual_pdf_path: Optional[str] = None 

# Schema para criar (recebe do Frontend)
class MotoCreate(MotoBase):
    pass


class MotoUpdate(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[str] = None
    manual_pdf_path: Optional[str] = None

# Schema para devolver (manda pro Frontend)
class MotoResponse(MotoBase):
    id: int

    class Config:
        from_attributes = True # Antigo orm_mode