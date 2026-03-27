from sqlalchemy.orm import Session
from llm.services.rag_orchestrator import rag_orchestrator
from app.models.chat_model import ChatLog
from app.models.moto_model import Moto
import json

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        # Instância global que já carrega o Chroma e o LLM uma vez só
        self.rag = rag_orchestrator 

    def _moto_concluida(self, moto_id: int) -> bool:
        moto = self.db.get(Moto, moto_id)
        if not moto or not moto.estado:
            return False

        estado_normalizado = str(moto.estado).strip().lower()
        return estado_normalizado in {"concluida", "concluída"}

    def gerar_resposta(self, pergunta: str, usuario_id: int, moto_id: int):
        if self._moto_concluida(moto_id):
            raise ValueError("Esta moto já foi concluída e não aceita novas mensagens no chat.")

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
        if self._moto_concluida(moto_id):
            raise ValueError("Esta moto já foi concluída e não pode mais ser finalizada no chat.")

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
        dados_resumo = self.rag.resumir_manutencao(historico_str)
        
        # O método resumir_manutencao retorna um dicionário python pronto.
        
        # Limpar o histórico de chat desta moto para que não sangre para os próximos serviços
        self.limpar_historico_moto(moto_id)
        
        if isinstance(dados_resumo, dict):
            # === DETECÇÃO DE PEÇAS DEFEITUOSAS POR ANÁLISE DE TEXTO ===
            # Em vez de confiar no LLM (que alucina), analisamos as mensagens
            # do MECÂNICO buscando nomes de peças do catálogo que apareçam
            # perto de palavras indicativas de defeito/troca.
            from app.models.peca_model import Peca
            pecas_catalogo = [p.nome for p in self.db.query(Peca).all()]
            
            # Palavras que indicam defeito real (não apenas consulta informativa)
            palavras_defeito = [
                "defeito", "defeituoso", "problema", "quebrou", "estraga",
                "não funciona", "não liga", "não pega", "parou", "falha",
                "trocar", "troca", "trocando", "substituir", "substituição",
                "consertar", "danificado", "estragado", "barulho", "vazando",
                "com defeito", "precisa trocar", "preciso trocar"
            ]
            
            # Junta apenas as mensagens do mecânico (não da IA)
            mensagens_mecanico = ""
            for log in logs_cronologicos:
                mensagens_mecanico += f" {log.pergunta.lower()} "
            
            pecas_defeituosas = []
            for peca_cat in pecas_catalogo:
                peca_lower = peca_cat.lower()
                # Verifica se a peça é mencionada pelo mecânico
                if peca_lower in mensagens_mecanico:
                    # Verifica se alguma palavra de defeito aparece na mesma mensagem
                    for log in logs_cronologicos:
                        msg = log.pergunta.lower()
                        if peca_lower in msg:
                            for palavra in palavras_defeito:
                                if palavra in msg:
                                    pecas_defeituosas.append(peca_cat)
                                    break
                            break
            
            
            pecas_llm = dados_resumo.get("pecas", [])
            if isinstance(pecas_llm, list):
                pecas_defeituosas.extend(pecas_llm)
            
            # Remove duplicatas (ignorando maiúsculas/minúsculas)
            pecas_finais = list({p.lower(): p for p in pecas_defeituosas}.values())
            
            dados_resumo["pecas"] = pecas_finais
            return dados_resumo
            
        # Fallback ultra-seguro
        return {
            "diagnostico": "Erro.",
            "atividades": "Erro.",
            "observacoes": "Erro.",
            "pecas": []
        }

    def listar_historico(self, usuario_id: int):
        """Retorna todo o histórico de conversas de um usuário."""
        return (
            self.db.query(ChatLog)
            .filter(
                ChatLog.user_id == usuario_id,
                ChatLog.user_id.isnot(None),
                ChatLog.moto_id.isnot(None),
            )
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