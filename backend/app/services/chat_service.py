from sqlalchemy.orm import Session
from llm.services.rag_orchestrator import rag_orchestrator  # <--- Importamos a INSTÂNCIA, não a classe
from app.models.chat_model import ChatLog # Importante para quando você descomentar o histórico

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        # Não precisamos fazer self.rag = RagOrchestrator()
        # Usamos a instância global que já carrega o Chroma e o LLM uma vez só
        self.rag = rag_orchestrator 

    def gerar_resposta(self, pergunta: str, usuario_id: int, moto_id: int):
        print(f"🔄 ChatService: Iniciando RAG para Moto ID {moto_id}...")
        
        try:
            # Chama o orquestrador (que agora usa Markdown e chunks grandes)
            resposta_texto = self.rag.processar_pergunta(
                db=self.db, 
                user_id=usuario_id, 
                moto_id=moto_id,
                pergunta_texto=pergunta
            )
            
            # Retorno padronizado para o Router/Frontend
            return {
                "resposta": resposta_texto,
                "moto_id": moto_id,
                "usuario_id": usuario_id
            }

        except Exception as e:
            print(f"❌ Erro Crítico no ChatService: {e}")
            return {
                "resposta": "Desculpe, o assistente encontrou um erro interno ao processar os manuais.",
                "moto_id": moto_id,
                "usuario_id": usuario_id
            }

    def listar_historico(self, usuario_id: int):
        """Retorna todo o histórico de conversas de um usuário."""
        return (
            self.db.query(ChatLog)
            .filter(ChatLog.user_id == usuario_id)
            .order_by(ChatLog.created_at.desc())
            .all()
        )

    def listar_historico_por_moto(self, moto_id: int):
        """Retorna todo o histórico de conversas de uma moto (todos os usuários)."""
        return (
            self.db.query(ChatLog)
            .filter(ChatLog.moto_id == moto_id)
            .order_by(ChatLog.created_at.desc())
            .all()
        )

    def listar_historico_usuario_moto(self, usuario_id: int, moto_id: int):
        """Retorna o histórico de conversas de um usuário com uma moto específica."""
        return (
            self.db.query(ChatLog)
            .filter(ChatLog.user_id == usuario_id, ChatLog.moto_id == moto_id)
            .order_by(ChatLog.created_at.desc())
            .all()
        )

    def limpar_historico_moto(self, moto_id: int):
        """Deleta todo o histórico de conversas de uma moto."""
        quantidade = (
            self.db.query(ChatLog)
            .filter(ChatLog.moto_id == moto_id)
            .delete()
        )
        self.db.commit()
        return quantidade