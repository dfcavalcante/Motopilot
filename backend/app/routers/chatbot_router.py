from fastapi import APIRouter, HTTPException, status
from typing import Optional
from app.services.chat_service import ChatService
from app.schemas.chatbot_schema import ChatRequest, ChatResponse

# --- ROTA ---
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

chat_service = ChatService()

#O async aqui é por conta que o chat nao responde imediatamente, ent ele pode fazer outras coisas enquanto espera a resposta

#A lógica de interagir_com_ia foi para o chat_service
@router.post("/perguntar", response_model=ChatResponse)
async def interagir_com_ia(request: ChatRequest):
    resultado = chat_service.gerar_resposta(request.pergunta)
    return resultado

@router.get("/historico/{usuario_id}")
async def buscar_historico(usuario_id: int):
    return chat_service.listar_historico(usuario_id)

@router.delete("/limpar/{usuario_id}")
async def limpar_chat(usuario_id: int):
    return {"message": "Contexto limpo"}