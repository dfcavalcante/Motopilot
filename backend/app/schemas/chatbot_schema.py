from typing import Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    pergunta: str
    usuario_id: int
    moto_id: int

class ChatResponse(BaseModel):
    resposta: str
    fonte: str # Ex: "Manual da Honda CG 160 - Pág 42"