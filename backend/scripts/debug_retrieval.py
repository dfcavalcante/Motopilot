import sys
import os
import chromadb
from chromadb.utils import embedding_functions

# Configuração
CHROMA_PATH = "./data/chroma_db"  # O caminho onde seu banco está salvo
COLLECTION_NAME = "manuais_motos"       # O nome da sua coleção (verifique se é esse mesmo no seu código)

def espiar_banco():
    print(f"🕵️ Conectando ao ChromaDB em: {CHROMA_PATH}")
    
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    
    # Usando o modelo de embedding padrão (all-MiniLM-L6-v2)
    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
    
    try:
        collection = client.get_collection(name=COLLECTION_NAME, embedding_function=embedding_func)
    except ValueError:
        print(f"❌ Coleção '{COLLECTION_NAME}' não encontrada! Verifique o nome no ingest.py")
        return

    query = "Como ligar a moto se ela não quer pegar"
    print(f"\n🔍 Buscando por: '{query}'")
    
    results = collection.query(
        query_texts=[query],
        n_results=3  # Pega os 3 melhores trechos
    )

    print("\nResultados encontrados (Chunks):")
    print("="*50)
    
    for i, doc in enumerate(results['documents'][0]):
        meta = results['metadatas'][0][i]
        print(f"\n📄 Resultado {i+1} (Página {meta.get('page', '?')}):")
        print("-" * 20)
        print(doc) # <--- AQUI É O QUE IMPORTA
        print("-" * 20)

if __name__ == "__main__":
    espiar_banco()