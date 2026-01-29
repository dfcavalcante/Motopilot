import re
import unidecode

def gerar_id_manual(texto: str) -> str:
    """
    Limpa o nome do arquivo para gerar um ID consistente.
    Remove UUIDs longos gerados automaticamente por sistemas de upload.
    """
    if not texto:
        return ""
    
    # 1. Remove a extensão .pdf
    texto = texto.replace(".pdf", "")

    # --- ESTRATÉGIA "CORTE CIRÚRGICO" DE UUID ---
    # UUIDs têm 36 caracteres. Se houver um "_" e o texto antes dele 
    # for muito longo (> 30 chars), assumimos que é um hash/uuid e removemos.
    if "_" in texto:
        partes = texto.split("_", 1) # Divide apenas no primeiro underscore
        prefixo = partes[0]
        
        # Se o prefixo for grande (típico de UUID) e tiver resto depois
        if len(prefixo) >= 30 and len(partes) > 1:
            texto = partes[1] # Pega apenas o que vem depois do UUID
    # ---------------------------------------------

    # 2. Remove acentos
    texto = unidecode.unidecode(texto)
    
    # 3. Tudo minúsculo
    texto = texto.lower()
    
    # 4. Substitui espaços e hifens restantes por underline
    texto = re.sub(r'[\s\-]+', '_', texto)
    
    # 5. Remove caracteres especiais (mantém apenas letras, números e _)
    texto = re.sub(r'[^a-z0-9_]', '', texto)
    
    # 6. Limpeza final de underlines duplicados ou nas pontas
    texto = re.sub(r'_{2,}', '_', texto)
    texto = texto.strip('_')
    
    return texto