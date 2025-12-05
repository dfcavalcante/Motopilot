import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # =================================================================
    # 1. Metadados da API
    # =================================================================
    API_NAME: str = "Motopilot"
    API_VERSION: str = '1.0.0'
    API_DESCRIPTION: str = "Assistente de Manutenção de motos e Treinamento de mecânicos"

    # =================================================================
    # 2. Segurança e Autenticação
    # =================================================================
    SECRET_KEY: str = "minha_chave_secreta_de_desenvolvimento_123" # senha ilustrativa
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120 

    # =================================================================
    # 3. Banco de Dados Relacional (PostgreSQL)
    # =================================================================
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "senha123"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "motopilot_db"

    # Propriedade que monta a URL automaticamente
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # =================================================================
    # 4. Banco de Dados Vetorial (ChromaDB)
    # =================================================================
    CHROMA_DB_PATH: str = os.path.join("data", "chroma_db")
    COLLECTION_NAME: str = "manuais_motos"

    # =================================================================
    # 5. Serviços de IA (LLM e Ollama)
    # =================================================================
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL_NAME: str = 'mistral:7b-instruct-v0.2'
    
    # =================================================================
    # 6. Configurações do RAG e Embeddings
    # =================================================================
    EMBEDDER_MODEL_NAME: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    CHUNK_SIZE: int = 400
    CHUNK_OVERLAP: int = 100
    K_NEIGHBORS: int = 3


# Instância para ser usada no resto do projeto
settings = Settings()