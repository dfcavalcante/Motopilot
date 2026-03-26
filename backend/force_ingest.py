import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from llm.data.pdf_processor import processar_manuais
from llm.services.vector_store import vector_store

def reingest():
    print("Iniciando varredura de manuais pendentes nos Modelos...")
    # Assume que a pasta manuais está na raiz do projeto (backend)
    pasta_manuais = os.path.join(os.getcwd(), 'manuals')
    
    chunks, metadatas = processar_manuais(pasta_manuais)
    if chunks:
        print(f"Injetando {len(chunks)} chunks da memoria...")
        vector_store.adicionar_chunks(textos=chunks, dados=metadatas)
        print("Finalizado!")
    else:
        print("Nenhum contexto recuperado.")

if __name__ == "__main__":
    reingest()
