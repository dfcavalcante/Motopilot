# Conexão e Queries ao chromadb
import os
import chromadb
from chromadb.utils import embedding_functions
import uuid
from backend.app.config import settings

# Inicializa a conexão com o ChromaDB local. A pasta de dados será criada automaticamente se não existir.
class VectorStoreService:
    def __init__(self):
        print(f"Inicializando ChromaDB")
        os.makedirs(settings.CHROMA_DB_PATH, exist_ok=True)
        self.client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)

        # Embedding automática 
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=settings.EMBEDDER_MODEL_NAME)

        # Cria ou Recupera a Coleção (Tabela)
        self.collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            embedding_function=self.embedding_fn
        )

    #Recebe uma lista de textos (chunks do manual) e seus dados (marca, modelo) e salva tudo no banco vetorial
    def adicionar_chunks(self, textos: list, dados: list):
        # Gera IDs únicos para cada pedaço (necessário para o Chroma)
        ids = [str(uuid.uuid4()) for _ in textos]

        try:
            self.collection.add(
                documents=textos, # O texto original
                datas=dados, # Ex: [{'modelo': 'CBR 150', 'pagina': 1}, ...]
                ids=ids # IDs únicos
            )
        except Exception as e:
            print(f"Erro ao adicionar chunks: {e}")

    # Recebe a pergunta do usuário, converte em vetor automaticamente e busca os trechos mais parecidos.
    def buscar_similaridade(self, pergunta: str, modelo_moto: str, k: int = 5) -> list:
        if not modelo_moto:
            print("Erro: Tentativa de busca sem modelo de moto definido.")
            return[]
        # Aplica o filtro antes de calcular a similaridade
        resultados = self.collection.query(
            query_texts=[pergunta],
            n_results=k,
            where={"modelo_moto": modelo_moto}
        )

        if resultados['documents']:
            return resultados['documents'][0]
        else:
            return[]
        
vector_store = VectorStoreService()