import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as con:
        print("Adicionando colunas faltantes em relatorios...")
        try:
            con.execute(text("ALTER TABLE relatorios ADD COLUMN IF NOT EXISTS imagem_path VARCHAR(255);"))
            print("Coluna 'imagem_path' adicionada em relatorios.")
        except Exception as e:
            print("Erro ao adicionar imagem_path:", e)
        
        try:
            con.execute(text("ALTER TABLE relatorios DROP COLUMN IF EXISTS assinatura_path;"))
            print("Coluna 'assinatura_path' dropada de relatorios.")
        except Exception as e:
            # SQLite does not support DROP COLUMN easily, but we're mostly dealing with Postgres.
            pass

        con.commit()
    print("Migração concluída com sucesso.")

if __name__ == "__main__":
    migrate()
