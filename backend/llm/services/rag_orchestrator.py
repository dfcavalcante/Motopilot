from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
# --- MUDANÇA AQUI: Usando langchain_core (mais moderno) ---
from langchain_core.prompts import PromptTemplate
# ----------------------------------------------------------
from langchain.chains import RetrievalQA
from app.models.moto_model import Moto 
from app.utils.text_utils import gerar_id_manual

# Instância global
rag_orchestrator = None

class RagOrchestrator:
    def __init__(self):
        print("🧠 Inicializando Cérebro RAG (Orchestrator)...")
        
        self.embedding_function = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        self.vector_store = Chroma(
            persist_directory="./chroma_db",
            embedding_function=self.embedding_function
        )
        
        self.llm = OllamaLLM(model="mistral", temperature=0) 

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não identificada no sistema."

        nome_completo = f"{moto.marca} {moto.modelo} {moto.ano}"
        filtro_moto = gerar_id_manual(nome_completo)
        
        print(f"🤖 RAG: Buscando contexto para ID: '{filtro_moto}'")

        retriever = self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={
                "k": 5, 
                "filter": {"modelo_moto": filtro_moto} 
            }
        )

        # Prompt "Sniper"
        prompt_template = """
        Você é um Assistente Técnico Mecânico especializado. Sua função é dar respostas EXATAS e DIRETAS.
        
        CONTEXTO TÉCNICO RETIRADO DO MANUAL:
        {context}
        
        PERGUNTA DO USUÁRIO: 
        {question}

        REGRAS RIGOROSAS:
        1. Se a resposta for um valor numérico (pneu, óleo, torque), responda APENAS o valor e a unidade.
        2. NÃO explique como procurar no manual. NÃO dê conselhos genéricos.
        3. Se houver uma tabela no contexto, extraia o dado exato.
        4. Exemplo de resposta boa: "Dianteiro: 60/100-17M/C 33L".
        5. Se a informação NÃO estiver no contexto, diga apenas: "Informação não encontrada no manual."

        RESPOSTA TÉCNICA:
        """
        
        PROMPT = PromptTemplate(
            template=prompt_template, 
            input_variables=["context", "question"]
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT}
        )

        try:
            resposta = qa_chain.invoke(pergunta_texto)
            return resposta['result']
        except Exception as e:
            print(f"❌ Erro no LLM: {e}")
            return "Desculpe, ocorreu um erro ao consultar o manual."

rag_orchestrator = RagOrchestrator()