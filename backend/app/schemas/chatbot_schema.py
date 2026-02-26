from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ChatRequest(BaseModel):
    pergunta: str
    usuario_id: int
    moto_id: int

class ChatResponse(BaseModel):
    resposta: str
    fonte: str # Ex: "Manual da Honda CG 160 - Pág 42"

class ChatHistoricoItem(BaseModel):
    id: int
    pergunta: str
    resposta_ia: str
    moto_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True