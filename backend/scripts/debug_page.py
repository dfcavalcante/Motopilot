import sys
import os
import chromadb
from chromadb.utils import embedding_functions
from app.config import settings

# Ajuste de path
sys.path.append(os.getcwd())

def investigar_pagina_especifica():
    print(f"🕵️ Investigando o banco: {settings.CHROMA_DB_PATH}")
    
    client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
    embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=settings.EMBEDDER_MODEL_NAME)
    
    try:
        collection = client.get_collection(name=settings.COLLECTION_NAME, embedding_function=embedding_fn)
    except Exception:
        print("❌ Coleção não encontrada.")
        return

    # A página no PDF era índice 44, então salvamos como 45 (i+1)
    PAGINA_ALVO = 45 
    
    print(f"🔍 Buscando chunks salvos da página {PAGINA_ALVO}...")

    # Busca EXATA por metadados (não por texto)
    results = collection.get(
        where={"page": PAGINA_ALVO}
    )

    if not results['documents']:
        print(f"❌ NADA ENCONTRADO para a página {PAGINA_ALVO}.")
        print("Tente vizinhas: 44 ou 46...")
    else:
        print(f"✅ Sucesso! Encontrei {len(results['documents'])} pedaços dessa página.")
        print("="*50)
        for doc in results['documents']:
            print(doc)
            print("-" * 20)
        print("="*50)

if __name__ == "__main__":
    investigar_pagina_especifica()