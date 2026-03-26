import os
import sys

# Add backend dir to path so app can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as con:
        print("Checking if column exists...")
        try:
            # Check if column exists, and if not, add it
            # Different dbs handle IF NOT EXISTS on columns differently. Postgres 9.6+ supports it:
            con.execute(text("ALTER TABLE modelo_motos ADD COLUMN IF NOT EXISTS ano INTEGER NOT NULL DEFAULT 2024;"))
            print("Coloana 'ano' garantida na tabela modelo_motos.")
        except Exception as e:
            print("Erro ao adicionar coluna (pode já existir):", e)
            
        print("Removendo constraints antigas e adicionando nova...")
        try:
            con.execute(text("ALTER TABLE modelo_motos DROP CONSTRAINT IF EXISTS modelo_motos_marca_key;"))
            con.execute(text("ALTER TABLE modelo_motos DROP CONSTRAINT IF EXISTS modelo_motos_modelo_key;"))
        except Exception as e:
            print("Erro ao dropar constraints antigas:", e)

        try:
            # PostgreSQL requires explicit unique constraints or indexes
            # SQLite does not support DROP CONSTRAINT easily without table recreation,
            # but psycopg2 implies PostgreSQL. Let's just create the unique index.
            con.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_modelo_motos_marca_modelo_ano ON modelo_motos (marca, modelo, ano);"))
        except Exception as e:
            print("Erro ao criar restrição composta:", e)

        con.commit()
    print("Migração executada com sucesso.")

if __name__ == "__main__":
    migrate()
