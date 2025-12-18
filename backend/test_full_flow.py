import sys
import os

# Ajuste de path
sys.path.append(os.getcwd())

from app.database.connections import SessionLocal
from llm.services.rag_orchestrator import rag_orchestrator
from app.models.moto_model import Moto
from app.models.user_model import User

def teste_fluxo_completo():
    db = SessionLocal()
    
    try:
        print("🛠️ Preparando cenário de teste...")
        
        # 1. Garantir que temos um Usuário
        user = db.query(User).filter_by(email="teste@motopilot.com").first()
        if not user:
            print("Criando usuário de teste...")
            # CORREÇÃO AQUI: Usando os nomes em português do seu modelo
            user = User(
                nome="MecanicoTeste",       # Antes era username
                email="teste@motopilot.com",
                senha_hash="123",           # Antes era password_hash
                cargo="mechanic"            # Antes era role
            )
            db.add(user)
            db.commit()
            
        # 2. Garantir a Moto (O nome DEVE bater com o nome do PDF que você ingeriu)
        # Se você ingeriu 'Honda_Biz_110i_2023.pdf', vamos criar essa moto
        nome_pdf_ingerido = "Honda_Biz_110i_2023" # <--- AJUSTE AQUI SE PRECISAR
        
        # Tentamos achar a moto, ou criamos uma "falsa" só para o teste bater com o PDF
        moto = db.query(Moto).filter(Moto.modelo.like(f"%{nome_pdf_ingerido}%")).first()
        
        if not moto:
            print(f"Criando moto de teste compatível com o PDF '{nome_pdf_ingerido}'...")
            
            # CORREÇÃO: Remova 'cilindrada' se não existir no modelo
            # E mude 'ano_fabricacao' para 'ano' se for o caso.
            moto = Moto(
                marca="Honda", 
                modelo=nome_pdf_ingerido, 
                ano=2023  # <--- Mudei de ano_fabricacao para ano (confira no seu modelo!)
                # cilindrada=110  <--- COMENTEI essa linha pois ela causou erro
            )
            
            db.add(moto)
            db.commit()
        
        # 3. Executar o Orchestrator
        pergunta = "Não estou conseguindo ligar a moto, o que faço?"
        
        print(f"\n🗣️ Perguntando: '{pergunta}'")
        print("⏳ Processando (pode levar alguns segundos)...")
        
        resposta = rag_orchestrator.processar_pergunta(
            db=db,
            user_id=user.id,
            moto_id=moto.id,
            pergunta_texto=pergunta
        )
        
        print("\nResultados:")
        print("="*40)
        print(f"🤖 IA: {resposta}")
        print("="*40)
        
    finally:
        db.close()

if __name__ == "__main__":
    teste_fluxo_completo()