from app.models.moto_model import Moto
from app.models.chat_model import ChatLog
from llm.services.vector_store import vector_store
from llm.services.llm_client import llm_client

# Importação da biblioteca de Re-ranking
from flashrank import Ranker, RerankRequest

class RagOrchestrator:
    def __init__(self):
        self.vector_store = vector_store
        self.llm_client = llm_client
        
        # Inicializa o modelo de Re-ranking (Nano/Small)
        # Ele é leve (~40MB) e roda localmente na CPU muito rápido.
        print("🧠 Carregando modelo de Re-ranking (FlashRank)...")
        self.ranker = Ranker(model_name="ms-marco-MiniLM-L-12-v2")

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        # 1. Recupera os dados da Moto
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não encontrada."

        print(f"🤖 RAG Iniciado | Buscando no manual da moto ID: {moto_id} ({moto.modelo})")

        # 2. Recuperação Inicial (Retrieval)
        # IMPORTANTE: Certifique-se de que K_NEIGHBORS no config.py esteja ALTO (ex: 50).
        # Precisamos pegar uma "rede larga" para trazer a tabela técnica que está escondida.
        contexto_bruto = self.vector_store.buscar_similaridade(
            pergunta=pergunta_texto, 
            moto_id=moto_id
        )

        if not contexto_bruto:
            return "Desculpe, não encontrei informações sobre essa moto no manual processado."

        print(f"📥 Recuperados {len(contexto_bruto)} chunks brutos. Iniciando Re-ranking...")

        # 3. Re-ranking (A Mágica)
        # Transformamos a lista de strings no formato que o FlashRank entende
        passagens = [
            {"id": str(i), "text": texto} 
            for i, texto in enumerate(contexto_bruto)
        ]

        requisicao_rerank = RerankRequest(
            query=pergunta_texto,
            passages=passagens
        )

        # O modelo reordena baseado na relevância real com a pergunta
        resultados_rerank = self.ranker.rerank(requisicao_rerank)

        # Pegamos apenas os TOP 5 melhores depois do re-ranking
        # Isso descarta o "lixo" de segurança que não tem a ver com a pergunta técnica
        top_chunks = resultados_rerank[:5]
        
        # Reconstrói a string de contexto apenas com a "nata" da informação
        contexto_refinado = [res['text'] for res in top_chunks]
        contexto_str = "\n\n".join(contexto_refinado)

        print("\n" + "="*40)
        print(f"💎 CONTEXTO REFINADO (Top {len(top_chunks)}):")
        # Mostra o primeiro chunk (que agora deve ser a tabela técnica!)
        if top_chunks:
            print(f"Top 1 Score: {top_chunks[0].get('score')}")
            print(top_chunks[0]['text'][:300] + "...") 
        print("="*40 + "\n")

        # 4. Prompt do Sistema (Limpo, sem filtros manuais)
        prompt_sistema = f"""
        Você é um mecânico especialista assistente chamado Motopilot.
        Você está respondendo sobre a moto: {moto.marca} {moto.modelo} (Ano {moto.ano}).
        
        Use EXCLUSIVAMENTE o contexto abaixo retirado do manual oficial para responder.
        Se a informação não estiver no contexto, diga que não encontrou.
        Seja técnico, direto e cite valores numéricos se houver.
        Liste passos em caso de procedimento.
        
        CONTEXTO DO MANUAL (Ordenado por relevância):
        {contexto_str}
        """

        # 5. Gera a Resposta
        resposta_ia = self.llm_client.generate(prompt_sistema, pergunta_texto)

        # 6. Salva Log
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