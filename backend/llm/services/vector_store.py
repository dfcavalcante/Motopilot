# Conexão e Queries ao chromadb
import os
import chromadb
from chromadb.utils import embedding_functions
import uuid
# Certifique-se que o caminho do config está certo (app.config ou app.utils.config)
from app.config import settings 

class VectorStoreService:
    def __init__(self):
        print(f"Inicializando ChromaDB em: {settings.CHROMA_DB_PATH}")
        os.makedirs(settings.CHROMA_DB_PATH, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)

        # Embedding automática 
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=settings.EMBEDDER_MODEL_NAME
        )

        # Cria ou Recupera a Coleção
        self.collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME,
            embedding_function=self.embedding_fn
        )

    def adicionar_chunks(self, textos: list, dados: list):
        """
        Salva os textos no banco vetorial.
        'dados' deve conter o dicionário de metadados, incluindo 'moto_id'.
        """
        ids = [str(uuid.uuid4()) for _ in textos]

        try:
            self.collection.add(
                documents=textos,
                metadatas=dados, 
                ids=ids
            )
            print(f"💾 [ChromaDB] {len(textos)} chunks adicionados com sucesso!")
        except Exception as e:
            print(f"❌ [ChromaDB] Erro ao adicionar chunks: {e}")

    # --- A MUDANÇA PRINCIPAL ESTÁ AQUI ---
    def buscar_similaridade(self, pergunta: str, moto_id: int, k: int = settings.K_NEIGHBORS) -> list:
        """
        Busca no banco vetorial filtrando EXATAMENTE pelo ID da moto.
        """
        if moto_id is None:
            print("⚠️ Erro: Tentativa de busca sem ID de moto definido.")
            return []

        try:
            resultados = self.collection.query(
                query_texts=[pergunta],
                n_results=k, # Agora ele vai buscar 50 pedacinhos (Genérico)
                where={"moto_id": moto_id} 
            )

            if resultados and resultados['documents']:
                return resultados['documents'][0]
            else:
                return []
                
        except Exception as e:
            print(f"Erro na busca vetorial: {e}")
            return []
        
# Instância global para ser importada
vector_store = VectorStoreService()