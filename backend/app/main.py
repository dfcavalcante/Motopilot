from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- IMPORTS DO BANCO DE DADOS (NOVO) ---
from app.database.connections import engine, Base
# Importamos os Models para que o SQLAlchemy saiba que eles existem e crie as tabelas
from app.models.user_model import User
from app.models.moto_model import Moto
# Se você criar o maintenance depois, descomente a linha abaixo:
# from app.models.maintenance_model import Maintenance

# --- IMPORTS DAS ROTAS ---
from app.routers import moto_router
from app.routers import chatbot_router
from app.routers import auth_router
from app.routers import report_router
from app.routers import user_router

#uvicorn app.main:app --reload

# Import de Configurações
try:
    from backend.app.config import Settings
except ImportError:
    # Fallback caso não tenha o arquivo config.py ainda, para não quebrar o código
    class Settings:
        API_NAME = "MotoPilot AI"
        API_DESCRIPTION = "Software de IA para Mecânicos"
        API_VERSION = "1.0.0"

# --- CRIAÇÃO DAS TABELAS (MÁGICA ACONTECE AQUI) ---
# Isso verifica se as tabelas existem no banco. Se não existirem, ele cria.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=Settings.API_NAME,
    description=Settings.API_DESCRIPTION,
    version=Settings.API_VERSION
)

origins = [
    "http://localhost:5173", # Porta do React (Vite)
    "http://localhost:3000", # Porta do React (Create-React-App)
    "http://127.0.0.1:5173",
]

# --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8080", "*"], # Adicionei '*' para facilitar testes
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

# --- ROTA DE SAÚDE (HEALTH CHECK) ---
@app.get("/", tags=["Status"])
def read_root():
    return {"status": "online", "message": "API rodando e tabelas verificadas!"}

# --- REGISTRO DE ROTAS ---
app.include_router(moto_router.router)
#app.include_router(user_router.router) # Futuro: Rota de cadastro de usuários
#app.include_router(auth_router.router)
app.include_router(chatbot_router.router)
app.include_router(report_router.router)