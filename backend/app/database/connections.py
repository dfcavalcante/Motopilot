from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# CORREÇÃO: Importamos 'settings' (o objeto carregado) e não apenas o módulo 'config'
from app.config import settings 

# Agora acessamos a URL através do objeto settings
engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Função de dependência para injetar a sessão do banco
    nos endpoints do FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()