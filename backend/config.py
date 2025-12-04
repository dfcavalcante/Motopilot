from pydantic import BaseSettings

class Settings(BaseSettings):
    API_NAME: str = "Motopilot"
    API_VERSION: str = '1.0.0'
    API_DESCRIPTION: str =  "Assistente de Manutenção de motos e Treinamento de mecânicos"

    #aqui vai colocar a string da url do banco de dados
    DATABASE_URL: str

    #chave secreta que eu não tenho ctz pra que serve, mas no modelo pede para colocar
    SECRET_KEY: str
    ALGORITHM: str
    ACESS_TOKEN_EXPIRE: 120 #ele desloga automaticamente dps de 120 min pelo oq eu entendi

    # Serviços de IA
    LLM_MODEL_NAME: str = 'mistral:7b-instruct-v0.2'
    OLLAMA_URL: str = "http://localhost:11434"
    EMBEDDINGS_MODEL: str = "all-MiniLM-L6-v2"

    # Configurações do RAG e Embeddings
    EMBEDDER_MODEL_NAME = 'all-MiniLM-L6-v2'
    CHUNK_SIZE = 400
    CHUNK_OVERLAP = 100
    K_NEIGHBORS = 3

    class Config:
        env: str = '.venv'
