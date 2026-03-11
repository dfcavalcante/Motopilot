from sqlalchemy import Column, Integer, String
from app.database import Base

class Peca(Base):
    __tablename__ = "pecas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), unique=True, index=True)
