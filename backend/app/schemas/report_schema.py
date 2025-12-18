from pydantic import BaseModel, Field
from typing import Optional

class ReportBase(BaseModel):
    '''
    Campos que o relatório possuirá
    '''
    #selecionar a moto cadastrada, acho q n é str mas dps eu vejo
    moto: str = Field(..., example="Honda Cobalt")
    cliente: str = Field(..., example="Cliente do Geraldo Gerente")
    diagnostico: str = Field(..., example="O diagnóstico que foi feito é que teve um reator da moto que explodiu e o pedal que saltou pra fora bla bla")

    #Mecânico(s) responsáveis pela manutenção
    mecanicos: str = Field(..., example = "Marquinhos do Prompt") 
    atividades: str = Field(..., example = "Troca de pedal, troca de motor")
    
    #Peças que foram substituídas (se houver)
    pecas: Optional[str] = Field(..., example=["motor", "pedal", "buzina"])
    observacoes: Optional[str] = Field(..., example="Foi observado que a moto é de um modelo especial que saiu de linha por possuir defeitos de fábrica")

    #TODO: falta o campo de anexação de fotos que ainda não sei como adicionar que será Optional
    #TODO: falta tbm o campo da assinatura digital que será Optional
    
class ReportUpdate(ReportBase):
    '''
    Campos que serão editáveis, caso seja necessário alterar relatórios já criados
    Alterar apenas os campos necessários
    '''
    moto: Optional[str] #DNV acho q n é str
    cliente: Optional[str]
    diagnostico: Optional[str]
    mecanicos: Optional[str]
    atividades: Optional[str]
    pecas: Optional[str]
    observacoes: Optional[str]

    #TODO: falta o campo de anexação de fotos que ainda não sei como adicionar que será Optional
    #TODO: falta tbm o campo da assinatura digital que será Optional

class ReportFilter(BaseModel):
    '''
    Campos adicionais para o filtro de relatórios
    '''
    #dnv acho que n é string, tem q ver isso aí
    moto: Optional[str]
    cliente: Optional[str]
    mecanicos: Optional[str]

    #Número da página que o cliente deseja, o ge garante que o número seja válido
    page: int = Field(1, ge=1)

    #Quantos itens a API deve retornar em uma única respostas, para não sobrecarregar o BD
    per_page: int = Field(10, ge=1, le=100)

class ReportResponse(ReportBase):
    id:int
    class Config:
        from_atributes = True


