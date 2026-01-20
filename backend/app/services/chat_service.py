from sqlalchemy.orm import Session
from datetime import datetime

from llm.services.rag_orchestrator import RagOrchestrator


class ChatService:
    def __init__(self, db: Session):
        """
        Injeta a sessão do banco de dados e inicializa o orquestrador RAG.
        """
        self.db = db
        self.rag = RagOrchestrator() 

    # Note que agora o método recebe moto_id
    def gerar_resposta(self, pergunta: str, usuario_id: int, moto_id: int):
        
        try:
            # Passamos o moto_id para o orquestrador fazer a busca no manual certo
            resposta_texto = self.rag.processar_pergunta(
                db=self.db, 
                user_id=usuario_id, 
                moto_id=moto_id, # <--- AQUI ESTÁ O SEGREDO
                pergunta_texto=pergunta
            )
            
            # (Opcional) Retornar também o ID da moto para confirmação
            return {
                "resposta": resposta_texto,
                "moto_utilizada": moto_id
            }

        except Exception as e:
            print(f"Erro: {e}")
            return {"resposta": "Erro ao processar sua pergunta."}

    '''def listar_historico(self, usuario_id: int):
        """
        Busca o histórico no banco de dados filtrando pelo usuário.
        """
        historico = self.db.query(ChatHistory)\
            .filter(ChatHistory.usuario_id == usuario_id)\
            .order_by(ChatHistory.data_criacao.desc())\
            .limit(50)\
            .all()
            
        return historico

    def salvar_feedback(self, chat_id: int, positivo: bool):
        """
        Atualiza o registro do chat com o feedback do usuário.
        Isso é CRUCIAL para melhorar seu RAG no futuro.
        """
        chat_entry = self.db.query(ChatHistory).filter(ChatHistory.id == chat_id).first()
        
        if chat_entry:
            chat_entry.feedback_positivo = positivo
            self.db.commit()
            return True
            
        return False'''