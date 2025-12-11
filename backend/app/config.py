import os
from pydantic_settings import BaseSettings

#AVISO: os dados sensíveis foram para o .ENV, pois não podem subir pro git
class Settings(BaseSettings):
    # =================================================================
    # 1. Metadados da API
    # =================================================================
    API_NAME: str = "Motopilot"
    API_VERSION: str = '1.0.0'
    API_DESCRIPTION: str = "Assistente de Manutenção de motos e Treinamento de mecânicos"

    # Propriedade que monta a URL automaticamente
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # =================================================================
    # 2. Banco de Dados Vetorial (ChromaDB)
    # =================================================================
    CHROMA_DB_PATH: str = os.path.join("data", "chroma_db")
    COLLECTION_NAME: str = "manuais_motos"

    # =================================================================
    # 3. Serviços de IA (LLM e Ollama)
    # =================================================================
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL_NAME: str = 'mistral:7b-instruct-v0.2'
    
    # =================================================================
    # 4. Configurações do RAG e Embeddings
    # =================================================================
    EMBEDDER_MODEL_NAME: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    CHUNK_SIZE: int = 400
    CHUNK_OVERLAP: int = 100
    K_NEIGHBORS: int = 5


# Instância para ser usada no resto do projeto
settings = Settings()