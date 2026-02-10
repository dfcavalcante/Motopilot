import chromadb
from chromadb.utils import embedding_functions
import os
# Importa suas configurações para garantir que usamos o MESMO modelo da app
from app.config import settings

def inspecionar_tabela():
    path = os.path.join("backend", "data", "chroma_db") 
    
    # Se o script estiver rodando dentro de backend/, ajuste o caminho
    if not os.path.exists(path):
        path = os.path.join("data", "chroma_db")

    print(f"🕵️ Conectando em: {path}")
    print(f"🧠 Usando Modelo de Embedding: {settings.EMBEDDER_MODEL_NAME}")
    
    # CONFIGURA O MODELO CORRETO
    # Isso impede que o Chroma baixe o default e garante compatibilidade com seus dados
    emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=settings.EMBEDDER_MODEL_NAME
    )

    client = chromadb.PersistentClient(path=path)
    
    # Tenta pegar a coleção existente
    try:
        # Passamos a função de embedding aqui para ele saber como ler os vetores
        collection = client.get_collection(name="manuais_motos", embedding_function=emb_fn)
    except Exception as e:
        print(f"❌ Erro ao pegar coleção (verifique o nome no vector_store.py): {e}")
        # Lista as disponíveis para ajudar
        print(f"Coleções disponíveis: {[c.name for c in client.list_collections()]}")
        return

    print(f"📚 Total de Chunks no Banco: {collection.count()}")

    # Agora sim, a busca vai funcionar porque os vetores são compatíveis
    results = collection.query(
        query_texts=["60/100", "80/100", "medida do pneu"],
        n_results=20
    )

    print("\n--- 🔍 RESULTADO DA BUSCA (QUERY: '60/100-17') ---")
    if not results['documents'][0]:
        print("❌ Nada encontrado.")
    else:
        for i, (doc, meta) in enumerate(zip(results['documents'][0], results['metadatas'][0])):
            print(f"\n📝 [Resultado {i+1}]:")
            print(f"📂 Fonte: {meta.get('source')} | Moto ID: {meta.get('moto_id')}")
            print("-" * 50)
            print(doc)
            print("-" * 50)
            
            if "pneu" in doc.lower():
                print("✅ TERMO 'PNEU' ENCONTRADO NO TEXTO!")

if __name__ == "__main__":
    inspecionar_tabela()