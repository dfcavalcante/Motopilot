from sqlalchemy.orm import Session
from llm.services.rag_orchestrator import rag_orchestrator
from app.models.chat_model import ChatLog
import json

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
            
            # Salva a conversa no banco de dados
            log = ChatLog(
                pergunta=pergunta,
                resposta_ia=resposta_texto,
                user_id=usuario_id,
                moto_id=moto_id
            )
            self.db.add(log)
            self.db.commit()
            
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

    def finalizar_chat(self, usuario_id: int, moto_id: int) -> dict:
        print(f"🔄 ChatService: Finalizando conversa Moto ID {moto_id}...")
        
        # 1. Recupera histórico
        logs = self.listar_historico_usuario_moto(usuario_id, moto_id)
        
        if not logs:
            return {
                "diagnostico": "Sem conversa anterior registrada.",
                "atividades": "-",
                "observacoes": "-",
                "pecas": []
            }

        # Inverte pois order_by é desc (do mais atual pro mais antigo), 
        # e o LLM entende melhor cronológico
        logs_cronologicos = list(reversed(logs))
        
        # 2. Formatar histórico como string
        historico_str = ""
        for log in logs_cronologicos:
            historico_str += f"Mecânico: {log.pergunta}\n"
            historico_str += f"IA: {log.resposta_ia}\n\n"
            
        # 3. Chamar LLM para resumo
        resposta_bruta = self.rag.resumir_manutencao(historico_str)
        
        # 4. Tentar limpar e parsear JSON
        try:
            # Algumas IAs ainda teimam em colocar marcações markdown
            clean_str = resposta_bruta.replace("```json", "").replace("```", "").strip()
            dados_parsed = json.loads(clean_str)
            
            return {
                "diagnostico": dados_parsed.get("diagnostico", "Não especificado."),
                "atividades": dados_parsed.get("atividades", "Não especificado."),
                "observacoes": dados_parsed.get("observacoes", "Não especificado."),
                "pecas": dados_parsed.get("pecas", [])
            }
        except json.JSONDecodeError as e:
            print(f"❌ Erro de parse JSON no resumo: {e} | Retorno foi: {resposta_bruta}")
            return {
                "diagnostico": "Erro ao extrair informações. Reveja a conversa manualmente.",
                "atividades": "-",
                "observacoes": f"Log bruto do LLM: {resposta_bruta[:150]}...",
                "pecas": []
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