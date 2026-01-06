import pdfplumber
import os

PDF_PATH = "manuals/Honda_Biz_110i_2023.pdf"

def testar_leitura_pagina():
    if not os.path.exists(PDF_PATH):
        print(f"❌ Arquivo não encontrado: {PDF_PATH}")
        return

    print(f"📖 Lendo arquivo: {PDF_PATH}")
    
    with pdfplumber.open(PDF_PATH) as pdf:
        # Pela sua imagem anterior, a página real é a 45 do PDF
        # Vamos olhar ao redor dela.
        found = False
        print("Procurando por 'Se o motor não ligar' nas páginas 40 a 50...")
        
        for i in range(40, 50): 
            page = pdf.pages[i]
            texto = page.extract_text()
            
            # Procurando a frase exata que estava no manual da imagem
            if texto and "Se o motor não ligar" in texto:
                print(f"\n✅ ACHEI O CONTEÚDO NA PÁGINA (Índice PDF: {i}):")
                print("="*40)
                print(texto) 
                print("="*40)
                found = True
                # Não vou dar break, quero ver se aparece mais de uma vez
        
        if not found:
            print("\n❌ AVISO: Não achei a frase 'Se o motor não ligar'.")
            print("Pode ser um problema de leitura de colunas.")

if __name__ == "__main__":
    testar_leitura_pagina()