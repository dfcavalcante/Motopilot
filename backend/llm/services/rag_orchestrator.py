from app.models.moto_model import Moto
from app.models.chat_model import ChatLog
# Ajuste o import conforme sua estrutura real
from llm.services.vector_store import vector_store
from llm.services.llm_client import llm_client

class RagOrchestrator:
    def __init__(self):
        self.vector_store = vector_store
        self.llm_client = llm_client

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        # 1. Recupera os dados da Moto
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não encontrada."

        print(f"🤖 RAG Iniciado | Buscando no manual da moto ID: {moto_id} ({moto.modelo})")

        # --- A CORREÇÃO ESTÁ AQUI ---
        # Antes: self.vector_store.buscar_similaridade(pergunta_texto, moto.modelo)
        # Agora: Passamos o ID para garantir que só pegamos chunks dessa moto específica
        contexto_list = self.vector_store.buscar_similaridade(
            pergunta=pergunta_texto, 
            moto_id=moto_id
        )
        
        # Junta os pedacinhos de texto em um só
        contexto_str = "\n\n".join(contexto_list)

        print("\n" + "="*40)
        print(f"📄 CONTEXTO RECUPERADO ({len(contexto_list)} trechos):")
        print(contexto_str) 
        print("="*40 + "\n")

        if not contexto_str:
            print("⚠️ AVISO: Nenhum contexto encontrado no banco para essa moto!")
            # Dica: Se não achou nada, talvez valha a pena retornar logo aqui
            # mas vamos deixar prosseguir para a IA tentar responder com conhecimento geral (opcional)

        # 3. Monta o Prompt para a IA
        prompt_sistema = f"""
        Você é um mecânico especialista assistente chamado Motopilot.
        Você está respondendo sobre a moto: {moto.marca} {moto.modelo} (Ano {moto.ano}).
        
        Use EXCLUSIVAMENTE o contexto abaixo retirado do manual oficial para responder.
        Se a informação não estiver no contexto, diga: "Desculpe, essa informação não consta no manual que eu li."
        Seja técnico, direto e cite valores numéricos se houver.
        
        CONTEXTO DO MANUAL:
        {contexto_str}
        """

        # 4. Chama a LLM (Geração)
        resposta_ia = self.llm_client.generate(prompt_sistema, pergunta_texto)

        # 5. Salva o Histórico
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

# Instância global
rag_orchestrator = RagOrchestrator()