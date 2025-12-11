from pydantic import BaseModel, Field
import backend.app.config as config 
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

SQLALCHEMY_DATABASE_URL = config.DATABASE_URL

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """
    Fornece uma sessao de banco de dados para os endpoints (routers).
    A sessao e fechada automaticamente apos o termino da requisicao.
    """
    db = SessionLocal()
    try:
        # A sessao e fornecida ao endpoint
        yield db
    finally:
        # Garante que a sessao seja fechada apos o uso
        db.close()