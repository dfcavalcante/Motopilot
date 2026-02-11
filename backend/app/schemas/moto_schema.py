from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

# Schema base (campos comuns)
class MotoBase(BaseModel):
    '''
    Schema base com os campos comuns.
    '''
    marca: str
    modelo: str
    ano: int 
    
    # --- A CORREÇÃO MÁGICA ---
    # 1. Nome da variável: numero_serie (igual ao banco de dados)
    # 2. Alias: "numeroSerie" (igual ao JSON que o Frontend envia)
    numero_serie: str = Field(..., alias="numeroSerie")
    
    # Opcionais (Sugiro alias aqui também se o front mandar camelCase)
    manual_pdf_path: str | None = Field(None, alias="manualPdfPath") 
    imagem_path: str | None = Field(None, alias="imagemPath")
    estado: str | None = None 
    descricao: str | None = None

    # Permite popular tanto por nome (backend) quanto por alias (frontend)
    model_config = ConfigDict(populate_by_name=True)

class MotoUpdate(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None
    manual_pdf_path: Optional[str] = Field(None, alias="manualPdfPath")
    imagem_path: Optional[str] = Field(None, alias="imagemPath")
    estado: Optional[str] = None
    # Também precisa corrigir no Update
    numero_serie: Optional[str] = Field(None, alias="numeroSerie")

# Schema para devolver (manda pro Frontend)
class MotoResponse(MotoBase):
    id: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)