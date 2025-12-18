import sys
import os

# Adiciona o diretório atual ao path para achar os módulos
sys.path.append(os.getcwd())

from llm.data.pdf_processor import processar_manuais
from llm.services.vector_store import vector_store

def main():
    # Pasta onde você vai colocar os PDFs
    PASTA_MANUAIS = "manuals"
    
    if not os.path.exists(PASTA_MANUAIS):
        os.makedirs(PASTA_MANUAIS)
        print(f"Pasta '{PASTA_MANUAIS}' criada. Coloque seus PDFs lá e rode novamente.")
        return

    print("Iniciando ingestão de manuais...")
    
    # Processa os PDFs e gera os chunks
    chunks, metadatas = processar_manuais(PASTA_MANUAIS)
    
    if not chunks:
        print("Nenhum chunk gerado. Verifique se os PDFs contêm texto legível.")
        return

    print(f"Total de trechos extraídos: {len(chunks)}")
    
    # Envia para o ChromaDB (usando seu serviço existente)
    print("Salvando no Banco Vetorial (Isso pode demorar um pouco)...")
    vector_store.adicionar_chunks(textos=chunks, dados=metadatas)
    
    print("Processo concluído.")

if __name__ == "__main__":
    main()