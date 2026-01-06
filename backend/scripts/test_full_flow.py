import sys
import os

# Ajuste de path para o Python encontrar a pasta 'app'
sys.path.append(os.getcwd())

from app.database.connections import SessionLocal
from llm.services.rag_orchestrator import rag_orchestrator
# Importamos o vector_store diretamente para fazer o "teste de visão" antes da IA
from llm.services.vector_store import vector_store 
from app.models.moto_model import Moto
from app.models.user_model import User

def teste_fluxo_completo():
    db = SessionLocal()
    
    try:
        print("🛠️ Preparando cenário de teste...")
        
        # ==============================================================================
        # 1. Garantir Usuário (Evita erro de chave estrangeira)
        # ==============================================================================
        user = db.query(User).filter_by(email="teste@motopilot.com").first()
        if not user:
            print("👤 Criando usuário de teste...")
            user = User(
                nome="MecanicoTeste",
                email="teste@motopilot.com",
                senha_hash="123",
                cargo="mechanic"
            )
            db.add(user)
            db.commit()
            print(f"   -> Usuário criado com ID: {user.id}")
            
        # ==============================================================================
        # 2. Garantir Moto (O modelo DEVE ser idêntico ao nome do arquivo PDF)
        # ==============================================================================
        nome_pdf_ingerido = "Honda_Biz_110i_2023" # <--- Tem que ser igual ao que o ingest.py salvou
        
        moto = db.query(Moto).filter(Moto.modelo == nome_pdf_ingerido).first()
        
        if not moto:
            print(f"🏍️ Criando moto de teste: '{nome_pdf_ingerido}'...")
            moto = Moto(
                marca="Honda", 
                modelo=nome_pdf_ingerido, 
                ano=2023
            )
            db.add(moto)
            db.commit()
            print(f"   -> Moto criada com ID: {moto.id}")
        else:
            print(f"🏍️ Moto encontrada no banco: {moto.modelo}")

        # ==============================================================================
        # 3. DEBUG: Verificar se o Vector Store está "enxergando" os dados
        # ==============================================================================
        # Usando a pergunta corrigida que contém as palavras-chave do manual ("motor", "ligar")
        pergunta = "Qual o procedimento se o motor não ligar?"
        
        print(f"\n🔎 DEBUG RAG: Verificando o banco vetorial para o modelo: '{moto.modelo}'")
        
        # Teste direto na "memória" da IA
        docs_encontrados = vector_store.buscar_similaridade(pergunta, moto.modelo, k=3)
        
        print(f"📄 Documentos encontrados: {len(docs_encontrados)}")
        
        if len(docs_encontrados) == 0:
            print("❌ ERRO CRÍTICO: O banco vetorial retornou 0 resultados!")
            print(f"   Verifique se o nome '{moto.modelo}' é EXATAMENTE igual ao salvo no ingest.py")
            return # Para aqui porque a IA não vai conseguir responder
        else:
            print(f"   ✅ Primeiro trecho encontrado: {docs_encontrados[0][:100]}...")
            print("   (O sistema de busca está funcionando!)")

        # ==============================================================================
        # 4. Executar o Orchestrator (A IA gera a resposta)
        # ==============================================================================
        print(f"\n🗣️ Perguntando para a IA: '{pergunta}'")
        print("⏳ Processando (pode levar alguns segundos)...")
        
        resposta = rag_orchestrator.processar_pergunta(
            db=db,
            user_id=user.id,
            moto_id=moto.id,
            pergunta_texto=pergunta
        )
        
        print("\n📝 Resultados Finais:")
        print("="*60)
        print(f"🤖 IA: {resposta}")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ Ocorreu um erro no teste: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        db.close()

if __name__ == "__main__":
    teste_fluxo_completo()