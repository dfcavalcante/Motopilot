from pydantic import BaseModel, Field
from typing import Optional, List

class ManualBase(BaseModel):
    '''
    Schema para os atributos essenciais do manual
    Não depende do conteúdo dentro!
    '''
    moto_modelo: str = Field(..., example="CG 160 Start")
    nome_arquivo: str = Field(..., example="CG 160 Start manual.pdg")

    #aq era o que estavam comentando, sobre uma mesma moto possuir novos manuais com o tempo
    versao: str = Field("1.0", example="2025-V1")
    #path_armazenamento: str (n sei se era para ter isso)

class ManualCreate(ManualBase):
    '''
    Schema usado para receber a requisição de upload de um novo manual
    '''
    pass

class ManualResponse(ManualBase):
    '''
    Schema de resposta para a API, incluindo o ID e metadados
    '''
    id: int = Field(..., example=1)
    #status para saber se a LLM já poderá utilizar o manual
    status_processamento: str = Field("Pendente", example="Processado")
    class Config:
        from_atrributes = True