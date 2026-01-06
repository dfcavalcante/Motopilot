from app.models.moto_model import Moto
from app.models.chat_model import ChatLog
from llm.services.vector_store import vector_store
from llm.services.llm_client import llm_client

class RagOrchestrator:
    def __init__(self):
        self.vector_store = vector_store
        self.llm_client = llm_client

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        # 1. Recupera os dados da Moto e do Usuário
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não encontrada."

        # CORREÇÃO CRÍTICA AQUI:
        # Não concatenamos 'moto.marca' com 'moto.modelo' porque o moto.modelo
        # já é o nome do arquivo PDF (ex: 'Honda_Biz_110i_2023')
        nome_para_busca = moto.modelo 

        print(f"🤖 RAG Iniciado | Buscando no manual: '{nome_para_busca}'")

        # 2. Busca no ChromaDB (Recuperação)
        contexto_list = self.vector_store.buscar_similaridade(pergunta_texto, nome_para_busca)
        
        # Junta os pedacinhos de texto em um só
        contexto_str = "\n\n".join(contexto_list)

        if not contexto_str:
            print("⚠️ AVISO: Nenhum contexto encontrado no banco para essa moto!")

        # 3. Monta o Prompt para a IA
        prompt_sistema = f"""
        Você é um mecânico especialista assistente chamado Motopilot.
        Use APENAS o contexto abaixo do manual da {moto.marca} {moto.modelo} para responder.
        Se a resposta não estiver no contexto, diga que não consta no manual.
        Seja técnico, direto e cite valores numéricos se houver.
        
        CONTEXTO DO MANUAL:
        {contexto_str}
        """

        # 4. Chama a LLM (Geração)
        resposta_ia = self.llm_client.generate(prompt_sistema, pergunta_texto)

        # 5. Salva o Histórico (Opcional, mas recomendado)
        try:
            log = ChatLog(
                user_id=user_id,
                moto_id=moto_id,
                pergunta=pergunta_texto,
                resposta_ia=resposta_ia
            )
            db.add(log)
            db.commit()
        except Exception as e:
            print(f"Erro ao salvar log: {e}")

        return resposta_ia

rag_orchestrator = RagOrchestrator()