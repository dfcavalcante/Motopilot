import sys
import os
sys.path.append(os.getcwd())

from app.database.connections import SessionLocal
from app.models.moto_model import Moto
from app.models.user_model import User
from app.models.chat_model import ChatLog

'''
Esse arquivo todo é apenas para teste do chatbot, ele cria uma moto e é possível fazer perguntas a ela.
'''
def seed():
    print("🌱 Iniciando o Seed do Banco de Dados...")
    
    db = SessionLocal()
    
    try:
        modelo_alvo = "Honda_Biz_110i_2023" 
        
        moto_existente = db.query(Moto).filter(Moto.modelo == modelo_alvo).first()
        
        if moto_existente:
            print(f"⚠️ A moto '{modelo_alvo}' já existe no banco (ID: {moto_existente.id}). Nada a fazer.")
        else:
            nova_moto = Moto(
                marca="Honda",
                modelo=modelo_alvo,
                ano=2023
            )
            db.add(nova_moto)
            db.commit()
            db.refresh(nova_moto)
            print(f"✅ Sucesso! Moto criada com ID: {nova_moto.id}")
            print(f"👉 Use 'moto_id': {nova_moto.id} no seu código.")

    except Exception as e:
        print(f"❌ Erro durante o seed: {e}")
        db.rollback() 

    finally:
        db.close()
        print("🔒 Conexão com o banco encerrada.")

if __name__ == "__main__":
    seed()