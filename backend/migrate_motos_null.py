import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as con:
        print("Relaxando restrições obsoletas na tabela motos...")
        try:
            con.execute(text("ALTER TABLE motos ALTER COLUMN marca DROP NOT NULL;"))
            print("Constraint NOT NULL removida de 'marca'.")
        except Exception as e:
            print("Aviso marca:", e)
            
        try:
            con.execute(text("ALTER TABLE motos ALTER COLUMN modelo DROP NOT NULL;"))
            print("Constraint NOT NULL removida de 'modelo'.")
        except Exception as e:
            print("Aviso modelo:", e)
        
        con.commit()
    print("Migração concluída com sucesso.")

if __name__ == "__main__":
    migrate()
