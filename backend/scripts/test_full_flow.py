import sys
import os

# --- 1. CONFIGURAÇÃO DE CAMINHO ---
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
# -------------------------------

from llm.services.rag_orchestrator import RagOrchestrator

# --- CLASSES FALSAS (MOCKS) ---
class MotoFalsa:
    """Finge ser o objeto Moto do banco SQL"""
    id = 1
    marca = "Honda"
    # AQUI ESTAVA O SEGREDO: O nome tem que bater com o PDF (sem o .pdf geralmente)
    modelo = "Honda_Biz_110i_2023" 

class BancoDeDadosFalso:
    """Finge ser a sessão do SQLAlchemy para o código não quebrar"""
    def query(self, model):
        return self 
    
    def filter(self, condition):
        return self 
    
    def first(self):
        return MotoFalsa() # Entrega a Biz falsa
    
    def add(self, obj):
        pass 
    
    def commit(self):
        pass 
# ------------------------------

def teste_com_mock_biz():
    print("\n🛠️  Iniciando teste RAG (Simulando Honda Biz)...")

    try:
        # 1. Carrega o RAG
        print("... Carregando Orquestrador ...")
        rag = RagOrchestrator()
        
        # 2. Prepara os dados
        db_fake = BancoDeDadosFalso()
        pergunta = "Como verificar o nível do óleo do motor?" # Pergunta específica para a Biz
        
        print(f"❓ Pergunta: '{pergunta}'")
        print(f"🏍️  Buscando manual: {MotoFalsa.modelo}")

        # 3. Chama a função com o NOME CORRETO: processar_pergunta
        print("... Processando ...\n")
        
        resposta = rag.processar_pergunta(
            db=db_fake,       
            user_id=999,      
            moto_id=1,        
            pergunta_texto=pergunta
        )

        # --- ADICIONE ISTO PARA VER A RESPOSTA FINAL ---
        print("\n" + "="*30)
        print("🤖 RESPOSTA FINAL DA IA:")
        print(resposta)
        print("="*30 + "\n")
        # -----------------------------------------------

        print("✅ Teste finalizado!")

    except Exception as e:
        print(f"\n❌ Erro durante o teste: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    teste_com_mock_biz()