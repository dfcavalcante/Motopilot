from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from sqlalchemy.orm import Session
from app.database.connections import get_db
from app.services.chat_service import ChatService
from app.schemas.chatbot_schema import ChatRequest, ChatResponse

# --- ROTA ---
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

#O async aqui é por conta que o chat nao responde imediatamente, ent ele pode fazer outras coisas enquanto espera a resposta

@router.post("/perguntar")
def conversar(request: ChatRequest, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.gerar_resposta(request.pergunta, request.usuario_id, request.moto_id)

@router.get("/historico/{usuario_id}")
async def buscar_historico(usuario_id: int, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.listar_historico(usuario_id)

@router.delete("/limpar/{usuario_id}")
async def limpar_chat(usuario_id: int):
    return {"message": "Contexto limpo"}