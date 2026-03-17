from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    '''
    Campos que o relatório possuirá
    '''
    #selecionar a moto cadastrada, acho q n é str mas dps eu vejo
    moto_id:  int = Field(..., example=1)
    cliente_id: int = Field(..., example=2)
    diagnostico: str = Field(..., example="O diagnóstico que foi feito é que teve um reator da moto que explodiu e o pedal que saltou pra fora bla bla")
    pecas: Optional[list[str]] = Field(None, example=["motor", "pedal", "buzina"])

    #Mecânico(s) responsáveis pela manutenção
    mecanicos: str = Field(..., example="Marquinhos do Prompt")
    atividades: str = Field(..., example="Troca de pedal, troca de motor")

    #Peças que foram substituídas (se houver)
    pecas: Optional[list[str]] = Field(None, example=["motor", "pedal", "buzina"])
    observacoes: Optional[str] = Field(None, example="Foi observado que a moto é de um modelo especial que saiu de linha por possuir defeitos de fábrica")

    #TODO: falta o campo de anexação de fotos que ainda não sei como adicionar que será Optional
    #TODO: falta tbm o campo da assinatura digital que será Optional
    
class ReportUpdate(BaseModel):
    '''
    Campos que serão editáveis, caso seja necessário alterar relatórios já criados
    Alterar apenas os campos necessários
    '''
    #Os campos devem ser opcionais para a atualização do relatório
    moto_id: Optional[int] = None
    cliente_id: Optional[int] = None
    diagnostico: Optional[str] = None
    mecanicos: Optional[str] = None
    atividades: Optional[str] = None
    pecas: Optional[list[str]] = None
    observacoes: Optional[str] = None
    status: Optional[str] = None


    #TODO: falta o campo de anexação de fotos que ainda não sei como adicionar que será Optional
    #TODO: falta tbm o campo da assinatura digital que será Optional

class ReportFilter(BaseModel):
    '''
    Campos adicionais para o filtro de relatórios
    '''
    #dnv acho que n é string, tem q ver isso aí
    moto_id: Optional[int] = None
    cliente_id: Optional[int] = None
    mecanicos: Optional[str] = None
    status: Optional[str] = None

    #Número da página que o cliente deseja, o ge garante que o número seja válido
    page: int = Field(1, ge=1)

    #Quantos itens a API deve retornar em uma única respostas, para não sobrecarregar o BD
    per_page: int = Field(10, ge=1, le=100)

class ReportResponse(ReportBase):
    id:int
    status: str
    created_at : datetime
    updated_at : Optional[datetime]
    class Config:
        from_attributes = True

    @field_validator("pecas", mode="before")
    @classmethod
    def split_pecas(cls, v):
        if isinstance(v, str):
            return [p.strip() for p in v.split(",") if p.strip()]
        return v


