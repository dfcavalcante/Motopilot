import os
import pymupdf4llm
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter

def processar_manual_unico(file_path: str, moto_id: int, modelo: str, ano: str):
    if not os.path.exists(file_path):
        return [], []

    try:
        # 1. Converte PDF para Markdown
        md_text = pymupdf4llm.to_markdown(file_path)
        
        # 2. Extração Estrutural
        headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]
        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
        md_header_splits = markdown_splitter.split_text(md_text)

        # 3. Splitter de Segurança
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500, # Aumentei um pouco para caber tabelas inteiras
            chunk_overlap=300
        )

        textos_finais = []
        metadatas_finais = []
        chunk_global_index = 0

        for split in md_header_splits:
            # Reconstrói a hierarquia padrão
            titulos = [split.metadata.get(h) for h in ["Header 1", "Header 2", "Header 3"]]
            caminho_secao = " > ".join([t for t in titulos if t])
            
            conteudo_original = split.page_content
            
            # --- O FIX PARA A BIZ (e outros manuais) ---
            # Se o conversor não detectou o título "Especificações", nós detectamos na marra.
            termos_tecnicos = ["ESPECIFICAÇÕES TÉCNICAS", "DADOS TÉCNICOS", "FICHA TÉCNICA"]
            
            # Se encontrar o termo no texto, força o contexto no topo
            if any(termo in conteudo_original.upper() for termo in termos_tecnicos):
                caminho_secao = "ESPECIFICAÇÕES TÉCNICAS (PRIORIDADE MÁXIMA)"
            
            # Injeta o contexto
            if caminho_secao:
                split.page_content = f"CONTEXTO: {caminho_secao}\n---\n{conteudo_original}"
            
            # Corta os chunks
            sub_splits = text_splitter.split_documents([split])

            for sub_split in sub_splits:
                conteudo_final = f"--- MANUAL: {modelo} ({ano}) ---\n{sub_split.page_content}"
                textos_finais.append(conteudo_final)
                
                meta = sub_split.metadata.copy()
                meta["source"] = os.path.basename(file_path)
                meta["moto_id"] = moto_id
                meta["modelo"] = modelo
                meta["chunk_index"] = chunk_global_index
                metadatas_finais.append(meta)
                chunk_global_index += 1

        print(f"✅ Processamento: {len(textos_finais)} chunks gerados.")
        return textos_finais, metadatas_finais

    except Exception as e:
        print(f"❌ Erro ao processar: {e}")
        return [], []