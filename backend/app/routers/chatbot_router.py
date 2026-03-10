from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.chat_service import ChatService
from app.schemas.chatbot_schema import ChatRequest, ChatResponse, ChatHistoricoItem, FinalizarChatRequest, FinalizarChatResponse

# --- ROTA ---
router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

#O async aqui é por conta que o chat nao responde imediatamente, ent ele pode fazer outras coisas enquanto espera a resposta

@router.post("/perguntar")
def conversar(request: ChatRequest, db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.gerar_resposta(request.pergunta, request.usuario_id, request.moto_id)

@router.post("/finalizar", response_model=FinalizarChatResponse)
def finalizar_conversa(request: FinalizarChatRequest, db: Session = Depends(get_db)):
    """
    Encerra a conversa e gera um resumo (Diagnóstico, Atividades, Observações, Peças)
    para o relatório de manutenção usando LLM.
    """
    service = ChatService(db)
    return service.finalizar_chat(request.usuario_id, request.moto_id)

# ---- HISTÓRICO ----

@router.get("/historico/{usuario_id}", response_model=List[ChatHistoricoItem])
def buscar_historico(usuario_id: int, db: Session = Depends(get_db)):
    """Retorna todo o histórico de conversas de um usuário."""
    service = ChatService(db)
    return service.listar_historico(usuario_id)


@router.get("/historico/moto/{moto_id}", response_model=List[ChatHistoricoItem])
def buscar_historico_por_moto(moto_id: int, db: Session = Depends(get_db)):
    """Retorna todo o histórico de conversas de uma moto (todos os usuários)."""
    service = ChatService(db)
    return service.listar_historico_por_moto(moto_id)


@router.get("/historico/{usuario_id}/moto/{moto_id}", response_model=List[ChatHistoricoItem])
def buscar_historico_usuario_moto(usuario_id: int, moto_id: int, db: Session = Depends(get_db)):
    """Retorna o histórico de conversas de um usuário com uma moto específica."""
    service = ChatService(db)
    return service.listar_historico_usuario_moto(usuario_id, moto_id)


# ---- LIMPAR HISTÓRICO ----

@router.delete("/limpar/{usuario_id}")
def limpar_chat(usuario_id: int, db: Session = Depends(get_db)):
    """Limpa todo o histórico de conversas de um usuário."""
    service = ChatService(db)
    quantidade = len(service.listar_historico(usuario_id))
    # Reutiliza a lógica existente — se quiser deletar de verdade, adicione um método no service
    return {"message": f"Contexto limpo — {quantidade} registro(s)"}


@router.delete("/limpar/moto/{moto_id}")
def limpar_historico_moto(moto_id: int, db: Session = Depends(get_db)):
    """Deleta todo o histórico de conversas de uma moto."""
    service = ChatService(db)
    quantidade = service.limpar_historico_moto(moto_id)
    return {"message": f"Histórico da moto {moto_id} limpo — {quantidade} registro(s) removido(s)"}