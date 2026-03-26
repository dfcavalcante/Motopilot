import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as con:
        print("Adicionando coluna missing em modelo_motos...")
        try:
            con.execute(text("ALTER TABLE modelo_motos ADD COLUMN IF NOT EXISTS manual_pdf_path VARCHAR(255);"))
            print("Coluna 'manual_pdf_path' garantida em modelo_motos.")
        except Exception as e:
            print("Erro ao adicionar manual_pdf_path a modelo_motos:", e)
        
        con.commit()
    print("Migração concluída com sucesso.")

if __name__ == "__main__":
    migrate()
