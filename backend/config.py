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
    # Chave secreta usada para assinar tokens JWT. 
    # Em produção, isso deve vir do arquivo .env e ser uma string aleatória longa.
    SECRET_KEY: str 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120  # Tempo em minutos (2 horas)

    # =================================================================
    # 3. Banco de Dados Relacional (PostgreSQL) - Dados de Sistema
    # =================================================================
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "sua_senha"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "motopilot_db"

    # Propriedade que monta a URL de conexão automaticamente para o SQLAlchemy
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # =================================================================
    # 4. Banco de Dados Vetorial (ChromaDB) - Dados de IA
    # =================================================================
    # Caminho onde os arquivos do Chroma serão salvos
    CHROMA_DB_PATH: str = os.path.join("data", "chroma_db")
    COLLECTION_NAME: str = "manuais_motos"

    # =================================================================
    # 5. Serviços de IA (LLM e Ollama)
    # =================================================================
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    # Modelo escolhido
    LLM_MODEL_NAME: str = 'mistral:7b-instruct-v0.2'
    
    # =================================================================
    # 6. Configurações do RAG e Embeddings
    # =================================================================
    EMBEDDER_MODEL_NAME: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384  # Dimensão do vetor para all-MiniLM
    
    # Parâmetros de Chunking
    CHUNK_SIZE: int = 400
    CHUNK_OVERLAP: int = 100
    
    # Quantos trechos buscar no banco para dar contexto
    K_NEIGHBORS: int = 3

    # =================================================================
    # Configuração do Pydantic
    # =================================================================
    class Config:
        # O Pydantic vai procurar um arquivo chamado .env para ler as variáveis
        # (como a SECRET_KEY e POSTGRES_PASSWORD)
        env_file = ".env"
        extra = "ignore" # Ignora variáveis extras no .env que não estão listadas aqui

# Instância para ser usada no resto do projeto
settings = Settings()
