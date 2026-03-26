import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as con:
        print("Adicionando colunas user_id e perfil_destino na tabela notifications...")
        try:
            con.execute(text("ALTER TABLE notifications ADD COLUMN user_id INTEGER;"))
            print("Coluna 'user_id' adicionada com sucesso.")
        except Exception as e:
            if "duplicate column name" not in str(e).lower():
                print("Erro ao adicionar user_id:", e)
            else:
                print("Coluna 'user_id' já existia.")
                
        try:
            con.execute(text("ALTER TABLE notifications ADD COLUMN perfil_destino VARCHAR(30);"))
            print("Coluna 'perfil_destino' adicionada com sucesso.")
        except Exception as e:
            if "duplicate column name" not in str(e).lower():
                print("Erro ao adicionar perfil_destino:", e)
            else:
                print("Coluna 'perfil_destino' já existia.")
        
        con.commit()
    print("Migração concluída com sucesso.")

if __name__ == "__main__":
    migrate()
