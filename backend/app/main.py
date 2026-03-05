from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
import os

# --- IMPORTS DO BANCO DE DADOS ---
# Certifique-se que seu arquivo database.py está em app/config/database.py
from app.database import engine, Base, get_db

# --- IMPORTS DOS MODELS (CRUCIAL) ---
# Importamos TODOS os models aqui para o SQLAlchemy criar as tabelas
# (Isso assume que você criou o __init__.py na pasta models conforme conversamos)
from app.models import Empresa, Cargo, User, Moto, ChatLog, Report

# --- IMPORTS DE UTILITÁRIOS ---
from app.utils.init_db import (
    criar_cargos_iniciais,
    garantir_coluna_lido_notificacoes,
    garantir_coluna_mecanico_id_motos,
)

# --- IMPORTS DAS ROTAS ---
from app.routers import moto_router, chatbot_router, report_router, user_router, dashboard_router, notificacoes_router

# from app.routers import auth_router

# --- CONFIGURAÇÕES ---
try:
    from backend.app.config import Settings
except ImportError:
    class Settings:
        API_NAME = "MotoPilot AI"
        API_DESCRIPTION = "SaaS de IA para Gestão de Oficinas"
        API_VERSION = "2.0.0 (Postgres Edition)"

# --- 1. CRIAÇÃO DAS TABELAS ---
# O SQLAlchemy olha os imports acima e cria as tabelas se não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=Settings.API_NAME,
    description=Settings.API_DESCRIPTION,
    version=Settings.API_VERSION
)

if os.path.exists("manuals"):
    app.mount("/manuals", StaticFiles(directory="manuals"), name="manuals")

# --- 2. EVENTO DE INICIALIZAÇÃO (POPULAR CARGOS) ---
@app.on_event("startup")
def on_startup():
    """
    Roda assim que a API liga.
    Verifica se os cargos (ADMIN, MECANICO) existem. Se não, cria.
    """
    db = next(get_db()) # Abre uma sessão temporária
    try:
        print("🔄 Verificando cargos iniciais...")
        garantir_coluna_lido_notificacoes(db)
        garantir_coluna_mecanico_id_motos(db)
        criar_cargos_iniciais(db)
    except Exception as e:
        print(f"❌ Erro ao inicializar banco: {e}")
    finally:
        db.close()

# --- CONFIGURAÇÃO DE CORS ---
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Usar lista específica (não pode ser "*" com credentials=True)
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

# --- ROTA DE SAÚDE ---
@app.get("/", tags=["Status"])
def read_root():
    return {
        "status": "online", 
        "database": "PostgreSQL", 
        "message": "MotoPilot Backend Operacional 🚀"
    }

# --- REGISTRO DE ROTAS ---
app.include_router(moto_router.router)
app.include_router(user_router.router)
#app.include_router(auth_router.router)
app.include_router(chatbot_router.router)
app.include_router(report_router.router)
app.include_router(dashboard_router.router)
<<<<<<< HEAD
app.include_router(notificacoes_router.router)
#app.include_router(report_router.router) #Quando tiver o report pronto, é só descomentar isso e criar o report_router.py
=======
app.include_router(notificacoes_router.router)
>>>>>>> 593f553492a5629ad06f8fbc429500d8add43f61
