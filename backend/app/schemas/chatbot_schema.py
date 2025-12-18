from pydantic import BaseModel, Field
from typing import Optional, List

class ChatRequest(BaseModel):
    pergunta: str
    moto_modelo: None # Ex: "Honda CG 160"
    historico: None   # Opcional: mensagens anteriores

class ChatResponse(BaseModel):
    resposta: str
    fonte: str # Ex: "Manual da Honda CG 160 - Pág 42"