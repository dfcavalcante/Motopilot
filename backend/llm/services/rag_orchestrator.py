import re
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from app.models.moto_model import Moto 
from app.utils.text_utils import gerar_id_manual
from app.config import settings
from llm.services.vector_store import vector_store
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
        
        # rede larga para trazer a tabela técnica
        contexto_bruto = self.vector_store.buscar_similaridade(
            pergunta=pergunta_texto, 
            modelo_id=modelo_id
        )

        if not contexto_bruto:
            return "Desculpe, não encontrei informações sobre essa moto no manual processado."

        print(f"📥 Recuperados {len(contexto_bruto)} chunks brutos. Iniciando Re-ranking...")

        # 3. Re-ranking
    
        passagens = [
            {"id": str(i), "text": texto} 
            for i, texto in enumerate(contexto_bruto)
        ]

        requisicao_rerank = RerankRequest(
            query=pergunta_texto,
            passages=passagens
        )

        resultados_rerank = self.ranker.rerank(requisicao_rerank)

        # Pega apenas os TOP 5 melhores depois do re-ranking
        top_chunks = resultados_rerank[:5]
        
        contexto_refinado = [res['text'] for res in top_chunks]
        contexto_str = "\n\n".join(contexto_refinado)

        # Se as instruções de prompt falharem, a regex garante que não constem no texto final
        contexto_str = re.sub(r'(?i)\(?\s*página\s*\d+\s*-?\s*\d*\s*\)?', '', contexto_str)
        contexto_str = re.sub(r'(?i)consulte\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', contexto_str)
        contexto_str = re.sub(r'(?i)procure\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', contexto_str)
        contexto_str = re.sub(r'(?i)dirija-se\s+a\s+(uma|um|a|o)?\s*concession[aá]ria[^\.\n]*[\.\n]?', '', contexto_str)
        contexto_str = re.sub(r'(?i)concession[aá]ria\s+honda[^\.\n]*[\.\n]?', '', contexto_str)

        print("\n" + "="*40)
        print(f"💎 CONTEXTO REFINADO (Top {len(top_chunks)}):")
        # Mostra o primeiro chunk
        if top_chunks:
            print(f"Top 1 Score: {top_chunks[0].get('score')}")
            print(top_chunks[0]['text'][:300] + "...") 
        print("="*40 + "\n")

        # 4. Prompt do Sistema
        prompt_sistema = f"""
        Você é um mecânico especialista assistente chamado Motopilot.
        Você está ajudando outro mecânico profissional sobre a moto: {moto.marca} {moto.modelo} (Ano {moto.ano}).
        
        INSTRUÇÕES DE RESPOSTA OBRIGATÓRIAS:
        1. Use o contexto abaixo retirado do manual oficial para responder.
        2. Seja técnico, direto e cite valores numéricos se houver.
        3. Liste passos caso seja um procedimento e remova dicas irrelevantes.
        4. RECUSE-SE A INVENTAR: Se a informação solicitada NÃO estiver no contexto do manual fornecido abaixo, responda APENAS: "Desculpe, o manual desta moto não detalha os procedimentos para esta solicitação." NÃO tente adivinhar passos ou criar guias da sua própria cabeça.
        5. É ABSOLUTAMENTE PROIBIDO sugerir que o usuário "procure um mecânico", "vá a uma concessionária" ou "busque ajuda profissional". O usuário JÁ É um mecânico profissional capacitado. OMITA qualquer aviso do tipo que vier do manual.
        6. OCORTE e EXCLUA qualquer referência a número de páginas (ex: "(página 59)", "veja a página X"). Se existir no contexto, simplesmente delete essa citação.
        7. Se a mensagem for algum tipo de saudação, responda de forma educada e cordial, mencionando brevemente que está pronto para ajudar com a moto.
        8. Se a pergunta for sobre um assunto totalmente fora de mecânica/motos (ex: culinária, política), responda APENAS: "O MotoPilot é um assistente exclusivo para manutenção de motos. Por favor, faça perguntas relacionadas à sua moto!" e NADA mais. NÃO anexe outras coisas a essa mensagem.
        9. Vá direto à resposta. NÃO crie cabeçalhos narrativos como "--- MANUAL ---" ou "Aqui está o que achei".
        10. NUNCA diga ao usuário para "acessar o manual". Você JÁ É o manual. Responda diretamente.
        11. FORMATAÇÃO ESTRITA: Você DEVE dar DUAS QUEBRAS DE LINHA (Enter duas vezes) DEPOIS DE CADA PASSO NUMERADO. NUNCA, SOB HIPÓTESE ALGUMA, escreva dois passos na mesma linha de texto. O número do próximo passo tem que sempre estar sozinho no começo de um novo parágrafo.

        EXEMPLO DO QUE ***NÃO*** FAZER:
        - "Remova a bateria (página 59)" -> ERRADO
        - "Consulte uma concessionária" -> PROIBIDO
        - "Procure ajuda profissional" -> PROIBIDO
        - "Acesse o manual para mais detalhes" -> ERRADO
        - "--- MANUAL DA MOTO ---" -> ERRADO (Vá logo pro formato ou pra resposta)
        - Inventar passos de como trocar o motor se o manual não tiver isso transcrito. -> PROIBIDO

        FORMATO DE RESPOSTA:
        - Se a pergunta for sobre um PROCEDIMENTO (como trocar, instalar, remover algo), estruture sua resposta usando formatação Markdown rigorosa.
        - REPITO: CADA PASSO (1., 2., 3...) DEVE ESTAR EM UM PARÁGRAFO ISOLADO COM LINHAS EM BRANCO ANTES E DEPOIS DELE.
        
        Exemplo de formato estruturado (Siga este padrão estritamente):
        
        ### [Título da tarefa]
        Siga este passo a passo:
        
        **Preparação**
        1. [Primeiro passo baseado no contexto do manual]
        
        2. [Segundo passo, em uma linha separada após quebra de linha]
        
        **Execução**
        3. [Primeiro passo da execução]
        
        4. [Segundo passo da execução, sempre após duas quebras de linha]
        
        5. [Terceiro passo da execução]
        
        **Finalização**
        6. [Últimos passos]
        
        ⚠️ **Atenção:**
        - [Alertas de segurança relevantes do manual, em formato de lista (bullet points)]
        
        - Se a pergunta for INFORMATIVA (medidas, especificações, dados técnicos), responda diretamente com listas pontuadas (bullet points) ou parágrafos curtos bem espaçados. Evite blocos textuais densos.
        
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
            
            # 5.2 Se o LLM alucinou e ainda assim gerou "(página X)" ou menções a concessionárias, deleta à força.
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
            prompt = f"Baseado estritamente no seguinte histórico de conversa:\n\n{historico_conversa}\n\nInstrução Suprema: Responda OBRIGATORIAMENTE em Português do Brasil de forma extremamente curta e concisa.\n\nTarefa: {pergunta}"
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
        diagnostico = perguntar_llm("Resuma em menos de 10 palavras qual foi o PROBLEMA, sintoma ou motivo da manutenção relatado. Exemplo: 'Vazamento de óleo', 'Troca de pneus' ou 'Revisão do motor'.")
        
        print("🤖 Gerando resumo [Atividades]...")
        atividades = perguntar_llm("Resuma as ações e reparos realizados em uma frase curta relatada na terceira pessoa (Ex: 'Substituição do óleo' ou 'Ajuste do guidão'). É totalmente PROIBIDO transcrever o diálogo ou dizer 'O mecânico perguntou...'. Vá direto ao serviço.")
        
        print("🤖 Gerando resumo [Observações]...")
        observacoes = perguntar_llm("Qual foi a conclusão técnica ou alerta dado sobre o conserto? (resuma em 1 frase curta). Se não houve, apenas diga 'Nenhuma observação'.")
        
        print("🤖 Gerando resumo [Peças]...")
        pecas_str = perguntar_llm("Quais peças o mecânico EXPLICITAMENTE relatou que estavam QUEBRADAS ou DEFEITUOSAS na conversa? Atenção de ouro: se o mecânico apenas perguntou 'Como trocar' ou pedir um guia, significa que ele só precisava de instruções, e NÃO que a roda/motor/painel estava defeituoso. Liste apenas o nome básico das peças realmente quebradas separadas por vírgula. Na dúvida ou se for só uma dúvida de procedimento, responda OBRIGATORIAMENTE: 'Nenhuma'.")
        
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
            # Remove termos extras como "da moto" e blocos parentéticos residuais
            for peca in pecas_list:
                peca = re.sub(r'\(.*?\)', '', peca).strip()
                peca = re.sub(r'(?i)\bda moto\b', '', peca).strip()
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