# Extração de texto e Chunking
import os
from pypdf import PdfReader
from typing import List, Dict, Any

def extrair_e_processar_manuais(diretorio_manuais: str) -> List[Dict[str, Any]]:
    
    dados_manuais_processados = []

    if not os.path.isdir(diretorio_manuais):
        print(f"ERRO: Diretório não encontrado: {diretorio_manuais}")
        return dados_manuais_processados

    for nome_arquivo in os.listdir(diretorio_manuais):
        # Verifica se o arquivo é um PDF
        if nome_arquivo.lower().endswith(".pdf"):
            caminho_completo = os.path.join(diretorio_manuais, nome_arquivo)
            texto_total = ""

            try:
                # Extração do Texto
                with open(caminho_completo, "rb") as arquivo:
                    leitor = PdfReader(arquivo)
                    
                    for pagina in leitor.pages:
                        texto_pagina = pagina.extract_text()
                        if texto_pagina:
                            texto_total += texto_pagina + "\n"
                            
            except Exception as e:
                print(f"ERRO ao ler o PDF '{nome_arquivo}': {e}")
                continue  # Pula para o próximo arquivo se houver erro

            if texto_total.strip():
                # Coleta de Metadados
                # Exemplo de extração simples do nome do arquivo (necessário refino posterior)
                modelo_moto = nome_arquivo.replace('.pdf', '').strip()
                
                dados_manuais_processados.append({
                    'filename': nome_arquivo,
                    'texto_bruto': texto_total,
                    'metadata_modelo': modelo_moto,
                    # Adicionar mais informações depois (Marca, ano, etc)
                })
                
    return dados_manuais_processados