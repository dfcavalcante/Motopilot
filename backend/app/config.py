import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # =================================================================
    # 1. Dados da API
    # =================================================================
    API_NAME: str = "Motopilot"
    API_VERSION: str = '1.0.0'
    API_DESCRIPTION: str = "Assistente de Manutenção de motos e Treinamento de mecânicos"

    # =================================================================
    # 2. Credenciais do Banco
    # =================================================================
    # O Pydantic vai buscar esses nomes exatos no seu arquivo .env
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str = "localhost" # Valor padrão caso não ache no .env
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str

    # Propriedade que monta a URL automaticamente usando as variáveis acima
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # =================================================================
    # 3. Banco de Dados Vetorial (ChromaDB)
    # =================================================================
    CHROMA_DB_PATH: str = os.path.join("data", "chroma_db")
    COLLECTION_NAME: str = "manuais_motos"

    # =================================================================
    # 4. Serviços de IA (LLM e Ollama)
    # =================================================================
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL_NAME: str = 'mistral:7b-instruct-v0.2'
    
    # =================================================================
    # 5. Configurações do RAG e Embeddings
    # =================================================================
    EMBEDDER_MODEL_NAME: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    CHUNK_SIZE: int = 400
    CHUNK_OVERLAP: int = 100
    K_NEIGHBORS: int = 5

    class Config:
        # Pega o diretório onde este arquivo (config.py) está
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Sobe um nível (de 'app' para 'backend') e procura o .env lá
        env_file = os.path.join(base_dir, "..", ".env")
        
        extra = "ignore"

# Instância para ser usada no resto do projeto
settings = Settings()