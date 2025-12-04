from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

# --- SCHEMAS (Definidos aqui para agilizar) ---
class ChatRequest(BaseModel):
    pergunta: str
    moto_modelo: Optional[str] = None # Ex: "Honda CG 160"
    historico: Optional[str] = None   # Opcional: mensagens anteriores

class ChatResponse(BaseModel):
    resposta: str
    fonte: str # Ex: "Manual da Honda CG 160 - Pág 42"

# --- ROTA ---
router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"]
)

@router.post("/perguntar", response_model=ChatResponse)
async def interagir_com_ia(request: ChatRequest):
    """
    Recebe a pergunta do engenheiro e consulta a IA (Simulado por enquanto).
    """
    
    # 1. Simulação da Lógica de Inteligência (RAG)
    # Na próxima sprint, aqui chamaremos o 'rag_service.py'
    
    pergunta_lower = request.pergunta.lower()
    
    if "óleo" in pergunta_lower:
        resposta_ia = "Para a Honda CG 160, utilize óleo 10W-30. A troca deve ser feita a cada 6.000 km."
        fonte_ia = "Manual do Proprietário - Página 38"
    
    elif "calibragem" in pergunta_lower or "pneu" in pergunta_lower:
        resposta_ia = "Pneu dianteiro: 25 PSI (apenas piloto). Pneu traseiro: 29 PSI."
        fonte_ia = "Adesivo de Serviço - Balança Traseira"
        
    else:
        resposta_ia = "Desculpe, não encontrei essa informação nos manuais técnicos cadastrados."
        fonte_ia = "Sistema IA"

    # 2. Retorna no formato que o Front-end espera (Validado pelo Schema ChatResponse)
    return ChatResponse(
        resposta=resposta_ia,
        fonte=fonte_ia
    )
