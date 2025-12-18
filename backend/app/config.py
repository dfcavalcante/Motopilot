import os
from typing import Optional
from urllib.parse import quote_plus  # <--- IMPORTANTE: Import necessário para corrigir a senha
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # =================================================================
    # 1. Dados da API
    # =================================================================
    API_NAME: str = "Motopilot"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Assistente de Manutenção de motos e Treinamento de mecânicos"

    # =================================================================
    # 2. Credenciais do Banco (PostgreSQL)
    # =================================================================
    # Se o arquivo .env não existir, ele usará estes valores padrão:
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "12345"
    POSTGRES_DB: str = "motopilot_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    
    # Propriedade que monta a URL automaticamente. 
    @property
    def DATABASE_URL(self) -> str:
        # CORREÇÃO: Codifica a senha para aceitar caracteres como @, ç, #, etc.
        senha_segura = quote_plus(self.POSTGRES_PASSWORD)
        
        return f"postgresql://{self.POSTGRES_USER}:{senha_segura}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

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
    EMBEDDER_MODEL_NAME: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    CHUNK_SIZE: int = 400
    CHUNK_OVERLAP: int = 100
    K_NEIGHBORS: int = 5

    # =================================================================
    # Configuração do Pydantic (V2)
    # =================================================================
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="latin-1",
        extra="ignore" # Ignora campos extras que possam estar no seu .env
    )

# Instância única para ser usada no resto do projeto
settings = Settings()