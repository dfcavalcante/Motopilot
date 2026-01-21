from pydantic import BaseModel, Field
from typing import Optional, List

#Field(example) é para facilitar em testes e na documentação

class MotoBase(BaseModel):
    '''
    Schema para criação de moto
    O path do manual foi adicionado aqui
    '''
    marca: str = Field(..., example="Honda")
    modelo: str = Field(..., example="CG 160 Start")
    ano: int = Field(..., example=2025)
    manual_pdf_path: str | None = None

class MotoUpdate(BaseModel):
    '''
    Schema para atualizar uma moto existente
    Pode atualizar apenas os campos necessários
    '''
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None

class MotoResponse(MotoBase):
    id: int
    class Config: #Para o pydantic ler os dados dos objetos
        from_attributes = True 

class MotoListResponse(BaseModel):
    #número total de registros que corresponde ao filtro/busca
    total_motos: int
    data: List[MotoResponse]

class MotoFilter(BaseModel):
    '''
    Campos adicionais para filtro, caso seja adicionado no futuro
    '''
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano_min: Optional[int] = None
    ano_max: Optional[int] = None

    #Número da página que o cliente deseja, o ge garante que o número seja válido
    page: int = Field(1, ge=1)

    #Quantos itens a API deve retornar em uma única respostas, para não sobrecarregar o BD
    per_page: int = Field(10, ge=1, le=100)

