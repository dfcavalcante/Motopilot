import os
import pymupdf4llm
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter

def processar_manual_unico(file_path: str, modelo_id: int, modelo: str, ano: str):
    """
    Processador com 'Memória de Contexto'.
    Ele carrega o título da seção anterior para dar significado a tabelas soltas.
    """
    if not os.path.exists(file_path):
        return [], []

    try:
        # 1. Converte PDF para Markdown
        md_text = pymupdf4llm.to_markdown(file_path)
        
        # --- CORREÇÃO DE ESTRUTURA ---
        # O manual muitas vezes não tem headers (#) explícitos, o que quebra o splitter.
        # Vamos injetar headers manuais para seções críticas.
        import re
        SECOES_IMPORTANTES = [
            "ESPECIFICAÇÕES TÉCNICAS", "DADOS TÉCNICOS", "FICHA TÉCNICA", 
            "DIMENSÕES", "MANUTENÇÃO", "MOTOR", "CHASSI/SUSPENSÃO", 
            "SISTEMA ELÉTRICO", "RODAS", "FREIOS", "PNEUS"
        ]
        
        for secao in SECOES_IMPORTANTES:
            # Procura a seção em linha isolada (ou quase) e adiciona o Header Markdown
            # (?m)^ vai casar inicio de linha no modo multiline
            # re.escape(secao) é bom para evitar problemas com caracteres especiais
            pattern = rf"(?m)^(\s*{re.escape(secao)}\s*$)"
            # Substitui por "# SECAO" direto, sem usar o grupo capturado \1 
            # para evitar trazer quebras de linha indesejadas que invalidam o header.
            md_text = re.sub(pattern, f"# {secao}", md_text)
            
        # 1.1 Achatamento de Tabelas Específicas (Pneus) para Natural Language
        # Transforma: | Pneu dianteiro | (medida) | 60/100... |
        # Em: Pneu dianteiro medida: 60/100...
        pattern_pneu = r"\|\s*(Pneu.*?)\s*\|\s*\((.*?)\)\s*\|\s*(.*?)\s*\|"
        def replacer_pneu(match):
            item = match.group(1).strip()
            atributo = match.group(2).strip()
            valor = match.group(3).strip().replace("<br>", ", ")
            return f"{item} {atributo}: {valor}."
        
        md_text = re.sub(pattern_pneu, replacer_pneu, md_text, flags=re.MULTILINE)
        
        # 1.2 Criação de Seção Dedicada para Pneus (Synthetic Chunking da Silva)
        # O objetivo é isolar "Pneu dianteiro..." e "Pneu traseiro..." em um chunk 
        # que tenha APENAS isso, pra maximizar o score de similaridade (0.78 vs 0.44).
        # Encontra o bloco de linhas que começa com "Pneu " (já achatado)
        pattern_block = r"(Pneu (dianteiro|traseiro).*?(\.|$)\n)+"
        
        def replacer_block(match):
            return f"\n# ESPECIFICAÇÕES DOS PNEUS\nMedidas dos pneus:\n{match.group(0)}\n# DADOS TÉCNICOS (Continuação)\n"
            
        md_text = re.sub(pattern_block, replacer_block, md_text, flags=re.MULTILINE)

        # 2. Divide por Cabeçalhos (Estrutura do Manual)
        headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]
        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
        md_header_splits = markdown_splitter.split_text(md_text)

        # 3. Splitter Secundário (Tamanho)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

        textos_finais = []
        metadatas_finais = []
        chunk_global_index = 0
        
        # --- MEMÓRIA DE CONTEXTO ---
        contexto_atual = ""
        # Palavras que indicam que entramos numa zona de tabelas importantes
        GATILHOS_TECNICOS = ["ESPECIFICAÇÕES", "DADOS TÉCNICOS", "FICHA TÉCNICA", "DIMENSÕES", "MANUTENÇÃO"]

        for split in md_header_splits:
            conteudo_original = split.page_content
            
            # Tenta pegar o título hierárquico (Ex: # Motor)
            titulos = [split.metadata.get(h) for h in ["Header 1", "Header 2", "Header 3"]]
            titulo_markdown = " > ".join([t for t in titulos if t])

            # Lógica de Atualização da Memória
            if titulo_markdown:
                contexto_atual = titulo_markdown
            else:
                # Se não tem título markdown, procura palavras-chave no texto bruto
                # (Isso salva manuais mal formatados)
                upper_content = conteudo_original.upper()[:500] # Olha só o começo
                for gatilho in GATILHOS_TECNICOS:
                    if gatilho in upper_content:
                        contexto_atual = f"SEÇÃO {gatilho}"
                        break
            
            # --- O PULO DO GATO ---
            # Injeta o contexto no texto antes de salvar
            if contexto_atual:
                split.page_content = f"CONTEXTO DO MANUAL: {contexto_atual}\n---\n{conteudo_original}"
            else:
                split.page_content = conteudo_original # Mantém original se não tiver contexto
            
            # Agora corta em pedaços menores
            sub_splits = text_splitter.split_documents([split])

            for sub_split in sub_splits:
                conteudo_final = f"--- MANUAL: {modelo} ({ano}) ---\n{sub_split.page_content}"
                textos_finais.append(conteudo_final)
                
                meta = sub_split.metadata.copy()
                meta["source"] = os.path.basename(file_path)
                meta["modelo_id"] = modelo_id
                meta["modelo"] = modelo
                meta["chunk_index"] = chunk_global_index
                metadatas_finais.append(meta)
                chunk_global_index += 1

        print(f"✅ Processamento Inteligente: {len(textos_finais)} chunks gerados.")
        return textos_finais, metadatas_finais

    except Exception as e:
        print(f"❌ Erro ao processar: {e}")
        return [], []

def processar_manuais(pasta_manuais: str):
    """
    Processa todos os manuais registrados no banco de dados.
    """
    from app.database import SessionLocal
    from app.models.moto_model import ModeloMoto

    db = SessionLocal()
    try:
        modelos = db.query(ModeloMoto).all()
        print(f"🔎 Encontrados {len(modelos)} modelos no banco.")

        todos_chunks = []
        todos_metadatas = []

        for moto in modelos:
            if not moto.manual_pdf_path:
                print(f"⚠️ Modelo {moto.modelo} sem manual cadastrado.")
                continue

            # Garante que o caminho está correto (relativo ou absoluto)
            caminho_pdf = moto.manual_pdf_path
            
            # Se o caminho salvo for apenas o nome do arquivo na pasta manuals, ajusta
            if not os.path.exists(caminho_pdf):
                caminho_alternativo = os.path.join(pasta_manuais, os.path.basename(caminho_pdf))
                if os.path.exists(caminho_alternativo):
                    caminho_pdf = caminho_alternativo
            
            if os.path.exists(caminho_pdf):
                print(f"📖 Processando manual: {moto.modelo}...")
                chunks, metas = processar_manual_unico(caminho_pdf, moto.id, moto.modelo, moto.ano)
                todos_chunks.extend(chunks)
                todos_metadatas.extend(metas)
            else:
                print(f"❌ Arquivo não encontrado: {caminho_pdf}")

        return todos_chunks, todos_metadatas
    finally:
        db.close()