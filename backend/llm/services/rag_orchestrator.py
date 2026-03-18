import re
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from app.models.moto_model import Moto 
from app.utils.text_utils import gerar_id_manual
from app.config import settings
from llm.services.vector_store import vector_store

# Importação da biblioteca de Re-ranking
from flashrank import Ranker, RerankRequest

class RagOrchestrator:
    def __init__(self):
        self.vector_store = vector_store
        
        # Inicializa LLM
        print(f"🧠 Inicializando LLM: {settings.LLM_MODEL_NAME}")
        self.llm_client = OllamaLLM(
            model=settings.LLM_MODEL_NAME,
            base_url=settings.OLLAMA_BASE_URL
        )
        
        # Inicializa o modelo de Re-ranking (Nano/Small)
        # Ele é leve (~40MB) e roda localmente na CPU muito rápido.
        print("🧠 Carregando modelo de Re-ranking (FlashRank)...")
        self.ranker = Ranker(model_name="ms-marco-MiniLM-L-12-v2")

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        # 1. Recupera os dados da Moto
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não identificada no sistema."

        print(f"🤖 RAG Iniciado | Buscando no manual da moto ID: {moto_id} ({moto.modelo})")

        # 2. Recuperação Inicial (Retrieval)
        # IMPORTANTE: Certifique-se de que K_NEIGHBORS no config.py esteja ALTO (ex: 50).
        # Precisamos pegar uma "rede larga" para trazer a tabela técnica que está escondida.
        contexto_bruto = self.vector_store.buscar_similaridade(
            pergunta=pergunta_texto, 
            moto_id=moto_id
        )

        if not contexto_bruto:
            return "Desculpe, não encontrei informações sobre essa moto no manual processado."

        print(f"📥 Recuperados {len(contexto_bruto)} chunks brutos. Iniciando Re-ranking...")

        # 3. Re-ranking (A Mágica)
        # Transformamos a lista de strings no formato que o FlashRank entende
        passagens = [
            {"id": str(i), "text": texto} 
            for i, texto in enumerate(contexto_bruto)
        ]

        requisicao_rerank = RerankRequest(
            query=pergunta_texto,
            passages=passagens
        )

        # O modelo reordena baseado na relevância real com a pergunta
        resultados_rerank = self.ranker.rerank(requisicao_rerank)

        # Pegamos apenas os TOP 5 melhores depois do re-ranking
        # Isso descarta o "lixo" de segurança que não tem a ver com a pergunta técnica
        top_chunks = resultados_rerank[:5]
        
        # Reconstrói a string de contexto apenas com a "nata" da informação
        contexto_refinado = [res['text'] for res in top_chunks]
        contexto_str = "\n\n".join(contexto_refinado)

        # Filtro Rigoroso (Hardcoded) para blindar o LLM de ver informações indesejadas
        # Se as instruções de prompt falharem, a regex garante que não constem no texto final
        contexto_str = re.sub(r'(?i)\(?\s*página\s*\d+\s*-?\s*\d*\s*\)?', '', contexto_str)
        contexto_str = re.sub(r'(?i)consulte\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', contexto_str)
        contexto_str = re.sub(r'(?i)procure\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', contexto_str)
        contexto_str = re.sub(r'(?i)dirija-se\s+a\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', contexto_str)
        contexto_str = re.sub(r'(?i)concession[aá]ria\s+honda[^\.\n]*[\.\n]?', '', contexto_str)

        print("\n" + "="*40)
        print(f"💎 CONTEXTO REFINADO (Top {len(top_chunks)}):")
        # Mostra o primeiro chunk (que agora deve ser a tabela técnica!)
        if top_chunks:
            print(f"Top 1 Score: {top_chunks[0].get('score')}")
            print(top_chunks[0]['text'][:300] + "...") 
        print("="*40 + "\n")

        # 4. Prompt do Sistema (Limpo, sem filtros manuais)
        prompt_sistema = f"""
        Você é um mecânico especialista assistente chamado Motopilot.
        Você está ajudando outro mecânico profissional sobre a moto: {moto.marca} {moto.modelo} (Ano {moto.ano}).
        
        INSTRUÇÕES DE RESPOSTA OBRIGATÓRIAS:
        1. Use o contexto abaixo retirado do manual oficial para responder.
        2. Seja técnico, direto e cite valores numéricos se houver.
        3. Liste passos caso seja um procedimento e remova dicas irrelevantes.
        4. OCORTE e EXCLUA qualquer referência a número de páginas (ex: "(página 59)", "veja a página X"). Se existir no contexto, simplesmente delete essa citação.
        5. OCORTE e EXCLUA qualquer recomendação para ir a uma concessionária, assistência técnica ou procurar um mecânico. O usuário JÁ É o mecânico trabalhando na moto. Apenas omita essas recomendações do texto final.

        EXEMPLO DO QUE ***NÃO*** FAZER:
        - "Remova a bateria (página 59)" -> ERRADO
        - "Consulte uma concessionária Honda" -> ERRADO

        EXEMPLO DE COMO ESTRUTURAR SUA RESPOSTA (Caso a pergunta seja sobre procedimentos):
        
        **Como trocar o pneu da moto**
        Siga este passo a passo para realizar a troca:
        
        **Preparação e Desmontagem**
        1. **Limpeza inicial:** Remova a capa protetora e limpe a moto.
        2. **Solte os componentes:** Desmonte a roda da moto utilizando as ferramentas apropriadas (como chaves de boca, estria ou Allen adequadas ao eixo).
        3. **Remoção da roda:** Retire completamente a roda da moto.
        4. **Remoção do pneu:** Só então, após retirar a roda da moto, desmonte o pneu do aro utilizando espátulas apropriadas.
        
        **Instalação e Montagem**
        5. **Substituição:** Instale o pneu novo no aro. Certifique-se do sentido de rotação correto (seta indicativa no flanco do pneu).
        6. **Remontagem da roda:** Coloque a roda montada com o pneu de volta na moto e insira o eixo.
        7. **Fixação e Ajustes:** Aperte o eixo com o torque recomendado e ajuste a tensão da corrente de transmissão (se for roda traseira).
        8. **Finalização:** Limpe a roda para remover resíduos de sabão de montagem ou sujeiras.
        
        ⚠️ **Atenção:**
        - **Calibração:** Verifique a pressão dos pneus a frio de acordo com a carga (piloto ou piloto+garupa).
        - **Segurança:** O fabricante não recomenda o uso de pneus reformados (remold) em motocicletas por questões de segurança.
        
        ---
        
        CONTEXTO DO MANUAL (Ordenado por relevância):
        {contexto_str}
        
        PERGUNTA DO USUÁRIO:
        {pergunta_texto}
        """
        
        # 5. Gera a Resposta
        try:
            print("🤖 Gerando resposta com LLM...")
            # Chamada direta ao Ollama
            resposta_ia = self.llm_client.invoke(prompt_sistema)
            
            # Pós-processamento OBRIGATÓRIO (Blindagem final)
            
            # 5.1 Remove recuos/indentações que causam blocos de código markdown indesejados no front-end
            linhas = str(resposta_ia).split('\n')
            linhas_limpas = [linha.lstrip() for linha in linhas]
            resposta_ia = '\n'.join(linhas_limpas)
            
            # 5.2 Se o LLM alucinou e ainda assim gerou "(página X)" ou menções a concessionárias, nós deletamos à força.
            resposta_ia = re.sub(r'(?i)\(?\s*página\s*\d+\s*-?\s*\d*\s*\)?', '', resposta_ia)
            resposta_ia = re.sub(r'(?i)consulte\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', resposta_ia)
            resposta_ia = re.sub(r'(?i)procure\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', resposta_ia)
            resposta_ia = re.sub(r'(?i)dirija-se\s+a\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', resposta_ia)
            resposta_ia = re.sub(r'(?i)concession[aá]ria\s+honda[^\.\n]*[\.\n]?', '', resposta_ia)
            
            return resposta_ia
        except Exception as e:
            print(f"❌ Erro no LLM: {e}")
            return "Desculpe, ocorreu um erro ao consultar o manual."

    def resumir_manutencao(self, historico_conversa: str) -> dict:
        """
        Extrator robusto que faz perguntas individuais ao LLM para evitar 
        qualquer tipo de erro de formatação (JSON/XML) com modelos locais menores.
        Retorna o dicionário pronto para o relatório.
        """
        def perguntar_llm(pergunta: str) -> str:
            prompt = f"Baseado estritamente no seguinte histórico de conversa:\n\n{historico_conversa}\n\nResponda diretamente e de forma extremamente curta (máximo 1 frase): {pergunta}"
            try:
                res = self.llm_client.invoke(prompt).strip()
                # Limpa aspas que o LLM possa adicionar
                return res.replace('"', '').replace("'", "")
            except Exception:
                return "Erro de processamento."

        print("================= HISTÓRICO ENVIADO ===================")
        print(historico_conversa)
        print("=======================================================")

        print("🤖 Gerando resumo [Diagnóstico]...")
        diagnostico = perguntar_llm("Resuma em menos de 10 palavras qual foi a dúvida, sintoma, defeito ou problema central que iniciou esta conversa.")
        
        print("🤖 Gerando resumo [Atividades]...")
        atividades = perguntar_llm("Em NENHUMA HIPÓTESE ultrapasse 15 palavras. Resuma o que foi consertado ou qual ajuda foi prestada. Evite frases robóticas. Responda apenas o essencial (Ex: 'Troca da bateria e limpeza' ou 'Instruções para bateria passadas').")
        
        print("🤖 Gerando resumo [Observações]...")
        observacoes = perguntar_llm("Qual foi a conclusão final ou dica geral dada ao término do atendimento? (resuma em 1 frase). Se não houve, apenas diga 'Nenhuma observação'.")
        
        print("🤖 Gerando resumo [Peças]...")
        pecas_str = perguntar_llm("Quais PEÇAS PRINCIPAIS ou componentes com defeito foram o alvo real da dúvida ou conserto? Retorne APENAS os nomes separados por vírgula. NÃO cite peças acessórias, parafusos, terminais, conectores ou fios apenas mencionados no passo a passo. Exemplo: 'Bateria, Farol'. Se nenhuma, responda 'Nenhuma'.")
        
        # Limpar a resposta das peças para uma lista
        pecas_list = []
        texto_pecas = pecas_str.lower()
        if "nenhuma" not in texto_pecas and "não aplicável" not in texto_pecas and "não especificado" not in texto_pecas:
            # Pega peças separadas por virgula ou ' e '
            texto_pecas_limpo = pecas_str.replace('.', '').replace(' e ', ',')
            pecas_list = [p.strip().title() for p in texto_pecas_limpo.split(',') if p.strip()]

        return {
            "diagnostico": diagnostico,
            "atividades": atividades,
            "observacoes": observacoes,
            "pecas": pecas_list
        }

# Instância global
rag_orchestrator = RagOrchestrator()