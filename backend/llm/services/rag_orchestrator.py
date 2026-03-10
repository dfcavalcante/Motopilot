from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from app.models.moto_model import Moto 
from app.utils.text_utils import gerar_id_manual
from app.config import settings
from llm.services.vector_store import vector_store

# Importação da biblioteca de Re-ranking
from flashrank import Ranker, RerankRequest

class RagOrchestrator:
    def __init__(self):
        self.vector_store = vector_store
        
        # Inicializa LLM
        print(f"🧠 Inicializando LLM: {settings.LLM_MODEL_NAME}")
        self.llm_client = OllamaLLM(
            model=settings.LLM_MODEL_NAME,
            base_url=settings.OLLAMA_BASE_URL
        )
        
        # Inicializa o modelo de Re-ranking (Nano/Small)
        # Ele é leve (~40MB) e roda localmente na CPU muito rápido.
        print("🧠 Carregando modelo de Re-ranking (FlashRank)...")
        self.ranker = Ranker(model_name="ms-marco-MiniLM-L-12-v2")

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        # 1. Recupera os dados da Moto
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não identificada no sistema."

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
        
        PERGUNTA DO USUÁRIO:
        {pergunta_texto}
        """
        
        # 5. Gera a Resposta
        try:
            print("🤖 Gerando resposta com LLM...")
            # Chamada direta ao Ollama
            resposta_ia = self.llm_client.invoke(prompt_sistema)
            return resposta_ia
        except Exception as e:
            print(f"❌ Erro no LLM: {e}")
            return "Desculpe, ocorreu um erro ao consultar o manual."

    def resumir_manutencao(self, historico_conversa: str) -> str:
        """
        Gera um resumo da conversa no formato JSON esperado para 
        preenchimento automático do relatório de manutenção.
        """
        prompt_resumo = f"""
        Você é um assistente técnico de oficinas de moto.
        Abaixo está a transcrição da conversa entre um mecânico e o sistema sobre a manutenção de uma moto.
        
        Você PRECISA extrair as informações e me devolver ESTRITAMENTE um objeto JSON válido.
        Sem conversinhas, sem marcações markdown como ```json, apenas inicie com {{ e termine com }}.
        As chaves obrigatórias do JSON são:
        - "diagnostico": Um parágrafo resumindo o problema relatado.
        - "atividades": Um parágrafo resumindo os passos/procedimentos que o mecânico precisa realizar ou realizou.
        - "observacoes": Pontos de atenção importantes citados na conversa (ex: torques específicos, cuidados).
        - "pecas": Um array de strings contendo apenas os nomes das peças trocadas. Ex: ["Filtro de Óleo", "Vela de Ignição"]. Se nenhuma peça foi citada, retorne um array vazio [].

        Se alguma não estiver clara, preencha com "Não especificado na conversa.".

        HISTÓRICO DA CONVERSA:
        {historico_conversa}
        """

        try:
            print("🤖 Gerando resumo de manutenção com LLM (Modo JSON)...")
            
            # Aqui configuramos format="json" para forçar que a resposta seja parseável
            # Dependerá se a versão do ollama instalada (backend/API) suporte esse parâmetro corretamente com a chain
            # Mas vamos forçar o model a responder apenas a string json limpa
            resposta_json_str = self.llm_client.invoke(prompt_resumo)
            return resposta_json_str
            
        except Exception as e:
            print(f"❌ Erro ao gerar resumo LLM: {e}")
            return '{{"diagnostico": "Erro ao processar.", "atividades": "Erro", "observacoes": "Erro", "pecas": []}}'

# Instância global
rag_orchestrator = RagOrchestrator()