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

    def _eh_saudacao(self, texto: str) -> bool:
        """Detecta se a mensagem é uma saudação simples."""
        saudacoes = [
            "oi", "olá", "ola", "hey", "ei", "eae", "eai", "e aí", "e ai",
            "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom",
            "como vai", "fala", "salve", "hello", "hi", "opa",
        ]
        texto_limpo = texto.strip().lower().rstrip("!?.,:;")
        return texto_limpo in saudacoes

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        # 1. Recupera os dados da Moto
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não identificada no sistema."

        # PRÉ-FILTRO: saudações são respondidas diretamente, sem RAG
        if self._eh_saudacao(pergunta_texto):
            return f"Olá! Estou pronto para ajudar com a manutenção da sua moto. Como posso te ajudar?"

        print(f"🤖 RAG Iniciado | Buscando no manual do modelo vinculado à moto ID: {moto_id} ({moto.modelo})")

        modelo_id = moto.modelo_moto_id
        if not modelo_id:
            return "Erro: Esta moto não possui um modelo associado para consulta de manual."

        # 2. Recuperação Inicial (Retrieval)
        # IMPORTANTE: Certifique-se de que K_NEIGHBORS no config.py esteja ALTO (ex: 50).
        # Precisamos pegar uma "rede larga" para trazer a tabela técnica que está escondida.
        contexto_bruto = self.vector_store.buscar_similaridade(
            pergunta=pergunta_texto, 
            modelo_id=modelo_id
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
        6. Se a mensagem for algum tipo de saudação, responda de forma educada e cordial, mencionando brevemente que está pronto para ajudar com a moto.
        7. Se a pergunta NÃO tiver relação DIRETA com motos, manutenção, peças ou mecânica (ex: emergências pessoais, incêndios, problemas domésticos, saúde, política, culinária, etc.), responda APENAS: "O MotoPilot é um assistente exclusivo para manutenção de motos. Por favor, faça perguntas relacionadas à sua moto!" e NADA mais. NÃO use informações de segurança ou emergência do manual para responder perguntas fora do contexto mecânico. IGNORE completamente o contexto do manual nesses casos.
        8. NUNCA diga ao usuário para "acessar o manual", "consultar o manual", "verificar no manual" ou "ver o manual". Você JÁ É a interface do manual. Todas as informações que você fornece já vieram do manual. Simplesmente responda com a informação diretamente.

        EXEMPLO DO QUE ***NÃO*** FAZER:
        - "Remova a bateria (página 59)" -> ERRADO
        - "Consulte uma concessionária Honda" -> ERRADO
        - "Acesse o manual para mais detalhes" -> ERRADO
        - "Consulte o manual do proprietário" -> ERRADO
        - "Consulte um técnico especialista" -> ERRADO
        - " Procure a sua concessionária" -> ERRADO
        - "Dirija-se a uma concessionária" -> ERRADO

        FORMATO DE RESPOSTA:
        - Se a pergunta for sobre um PROCEDIMENTO (como trocar, instalar, remover algo), use este formato:
        
        **[Título da tarefa]**
        Siga este passo a passo:
        
        **Preparação**
        1. [Primeiro passo baseado no contexto do manual]
        2. [Segundo passo]
        
        **Execução**
        3. [Passos principais retirados do manual]
        
        **Finalização**
        4. [Últimos passos]
        
        ⚠️ **Atenção:**
        - [Alertas de segurança relevantes do manual, se houver]
        
        - Se a pergunta for INFORMATIVA (medidas, especificações, dados técnicos), responda diretamente de forma clara e objetiva SEM usar o formato de passo a passo.
        
        IMPORTANTE: Use APENAS informações do contexto do manual abaixo. NÃO invente dados. NÃO misture informações de peças diferentes.
        
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
            
            # 5.3 Remove referências ao manual ("acesse o manual", "consulte o manual", etc.)
            resposta_ia = re.sub(r'(?i)(acesse|consulte|veja|verifique|confira|leia)\s+(o|no|a)?\s*manual[^\.\n]*[\.\n]?', '', resposta_ia)
            
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
        diagnostico = perguntar_llm("Resuma em menos de 10 palavras qual foi o PROBLEMA ou DEFEITO REAL relatado na moto. Considere apenas peças que o mecânico disse estar com defeito ou precisando de troca. Se o mecânico apenas pediu informações ou medidas de algo sem dizer que estava com defeito, NÃO inclua isso no diagnóstico.")
        
        print("🤖 Gerando resumo [Atividades]...")
        atividades = perguntar_llm("Em NENHUMA HIPÓTESE ultrapasse 15 palavras. Resuma o que foi consertado ou qual ajuda foi prestada. Evite frases robóticas. Responda apenas o essencial (Ex: 'Troca da bateria e limpeza' ou 'Instruções para bateria passadas').")
        
        print("🤖 Gerando resumo [Observações]...")
        observacoes = perguntar_llm("Qual foi a conclusão final ou dica geral dada ao término do atendimento? (resuma em 1 frase). Se não houve, apenas diga 'Nenhuma observação'.")
        
        print("🤖 Gerando resumo [Peças]...")
        pecas_str = perguntar_llm("Quais peças foram relatadas como DEFEITUOSAS ou precisando de TROCA/CONSERTO? Liste APENAS peças com defeito real relatado pelo mecânico. Se o mecânico apenas perguntou medidas ou informações sobre uma peça sem relatar defeito, NÃO inclua essa peça. Retorne os nomes separados por vírgula. Se nenhuma peça estava defeituosa, responda 'Nenhuma'.")
        
        # Limpar a resposta das peças para uma lista
        pecas_list = []
        texto_pecas = pecas_str.lower()
        if "nenhuma" not in texto_pecas and "não aplicável" not in texto_pecas and "não especificado" not in texto_pecas:
            # Pega peças separadas por virgula ou ' e '
            texto_pecas_limpo = pecas_str.replace('.', '').replace(' e ', ',')
            pecas_list = [p.strip().title() for p in texto_pecas_limpo.split(',') if p.strip()]
            
            # Remove artigos do início dos nomes (ex: "A Bateria" -> "Bateria")
            artigos = ["A ", "O ", "As ", "Os ", "Um ", "Uma ", "Uns ", "Umas "]
            pecas_limpas = []
            for peca in pecas_list:
                for artigo in artigos:
                    if peca.startswith(artigo):
                        peca = peca[len(artigo):]
                        break
                pecas_limpas.append(peca.strip())
            pecas_list = pecas_limpas

        return {
            "diagnostico": diagnostico,
            "atividades": atividades,
            "observacoes": observacoes,
            "pecas": pecas_list
        }

# Instância global
rag_orchestrator = RagOrchestrator()