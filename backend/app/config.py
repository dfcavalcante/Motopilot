import os
from typing import Optional
from urllib.parse import quote_plus
from pydantic_settings import BaseSettings, SettingsConfigDict

CURRENT_FILE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_FILE_DIR)

class Settings(BaseSettings):
    # =================================================================
    # 1. Dados da API
    # =================================================================
    API_NAME: str = "Motopilot"
    API_VERSION: str = "2.0.0"
    API_DESCRIPTION: str = "SaaS de IA para Gestão de Oficinas e Manutenção"

    # =================================================================
    # 2. Credenciais do Banco (PostgreSQL Exclusivo)
    # =================================================================
    # Valores padrão (fallback) caso o .env falhe ou não exista
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "admin" # Lembre-se: O ideal é vir do .env
    POSTGRES_DB: str = "motopilot_db"
    POSTGRES_HOST: str = "127.0.0.1"
    POSTGRES_PORT: int = 5432

    @property
    def DATABASE_URL(self) -> str:
        """
        Monta a URL de conexão usando PostgreSQL.
        """
        return f"postgresql://{self.POSTGRES_USER}:{quote_plus(self.POSTGRES_PASSWORD)}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # =================================================================
    # 3. Banco de Dados Vetorial (ChromaDB)
    # =================================================================
    CHROMA_DB_PATH: str = os.path.join(BACKEND_DIR, "data", "chroma_db")
    COLLECTION_NAME: str = "manuais_motos"

    # Define onde fica os manuais PDF
    MANUALS_DIR: str = os.path.join(BACKEND_DIR, "manuals")

    # =================================================================
    # 4. Serviços de IA (LLM e Ollama)
    # =================================================================
    OPENAI_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL_NAME: str = "mistral"
    
    # =================================================================
    # 5. Configurações do RAG e Embeddings
    # =================================================================
    EMBEDDER_MODEL_NAME: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    EMBEDDING_DIMENSION: int = 384
    CHUNK_SIZE: int = 1500
    CHUNK_OVERLAP: int = 300
    K_NEIGHBORS: int = 50

    # =================================================================
    # Configuração do Pydantic
    # =================================================================
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instância única
settings = Settings()