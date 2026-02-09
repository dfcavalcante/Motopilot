import os
from typing import Optional
from urllib.parse import quote_plus
from pydantic_settings import BaseSettings, SettingsConfigDict

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
    POSTGRES_PASSWORD: str = "12345" # Lembre-se: O ideal é vir do .env
    POSTGRES_DB: str = "motopilot_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    @property
    def DATABASE_URL(self) -> str:
        """
        Monta a URL de conexão do PostgreSQL.
        Usa quote_plus para garantir que senhas com caracteres especiais (@, #) funcionem.
        """
        senha_segura = quote_plus(self.POSTGRES_PASSWORD)
        
        return (
            f"postgresql://{self.POSTGRES_USER}:{senha_segura}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # =================================================================
    # 3. Banco de Dados Vetorial (ChromaDB)
    # =================================================================
    CHROMA_DB_PATH: str = os.path.join("data", "chroma_db")
    COLLECTION_NAME: str = "manuais_motos"

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
    K_NEIGHBORS: int = 40

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