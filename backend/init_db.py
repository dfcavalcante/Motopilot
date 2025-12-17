import sys
import os

# Adiciona o diretório atual ao path para o Python encontrar a pasta 'app'
sys.path.append(os.getcwd())

from app.database.connections import engine, Base
# IMPORTANTE: Importar os modelos para que o SQLAlchemy saiba que eles existem antes de criar
from app.models.user_model import User
from app.models.moto_model import Moto
from app.models.chat_model import ChatLog

def criar_tabelas():
    print("Conectando ao Banco de Dados...")
    try:
        # Cria todas as tabelas definidas nos modelos importados acima
        Base.metadata.create_all(bind=engine)
        print("Tabelas criadas com sucesso no PostgreSQL!")
    except Exception as e:
        print(f"Erro ao criar tabelas: {e}")

if __name__ == "__main__":
    criar_tabelas()