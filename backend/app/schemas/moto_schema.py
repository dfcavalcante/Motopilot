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
    
    numero_serie: str = Field(..., alias="numeroSerie")
    
    manual_pdf_path: str | None = Field(None, alias="manualPdfPath") 
    imagem_path: str | None = Field(None, alias="imagemPath")
    estado: str | None = None 
    descricao: str | None = None

    # Mecânico responsável (nullable — pode cadastrar sem atribuir)
    mecanico_id: Optional[int] = Field(None, alias="mecanicoId")

    # Permite popular tanto por nome (backend) quanto por alias (frontend)
    model_config = ConfigDict(populate_by_name=True)

class MotoUpdate(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None
    manual_pdf_path: Optional[str] = Field(None, alias="manualPdfPath")
    imagem_path: Optional[str] = Field(None, alias="imagemPath")
    estado: Optional[str] = None
    numero_serie: Optional[str] = Field(None, alias="numeroSerie")
    mecanico_id: Optional[int] = Field(None, alias="mecanicoId")

    model_config = ConfigDict(populate_by_name=True)

# Schema para devolver (manda pro Frontend)
class MotoResponse(MotoBase):
    id: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# Schema para concluir manutenção (recebe dados do relatório)
class ConcluirManutencaoRequest(BaseModel):
    '''
    Dados necessários para concluir a manutenção e gerar o relatório.
    '''
    cliente_id: int = Field(..., alias="clienteId")
    diagnostico: str
    mecanicos: str
    atividades: str
    pecas: Optional[list[str]] = None
    observacoes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)