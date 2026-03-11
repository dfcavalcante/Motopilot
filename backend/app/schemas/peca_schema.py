from pydantic import BaseModel, ConfigDict
from typing import Optional

class PecaBase(BaseModel):
    nome: str

class PecaCreate(PecaBase):
    pass

class PecaResponse(PecaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
