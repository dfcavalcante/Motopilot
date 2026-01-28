from app.models.moto_model import Moto
from app.models.chat_model import ChatLog
from llm.services.vector_store import vector_store
from llm.services.llm_client import llm_client
import logging

# Configuração simples de log para não poluir o terminal se não quiser
logger = logging.getLogger(__name__)

class RagOrchestrator:
    def __init__(self):
        self.vector_store = vector_store
        self.llm_client = llm_client

    def _identificar_intencao(self, texto: str) -> str:
        """
        Analisa a pergunta para definir o foco da busca (Roteamento Semântico Simples).
        Retorna o sufixo para expandir a query.
        """
        texto_lower = texto.lower()

        palavras_dados = [
            'qual', 'quanto', 'medida', 'capacidade', 'especificação', 
            'valor', 'dimensão', 'peso', 'torque', 'ficha', 'técnica', 
            'calibragem', 'pressão', 'pneu', 'oleo', 'combustivel', 'tanque'
        ]
        
        palavras_acao = [
            'como', 'trocar', 'ajustar', 'limpar', 'remover', 'instalar', 
            'manutenção', 'procedimento', 'verificar', 'acionar', 'ligar', 
            'desligar', 'regular', 'substituir', 'passo a passo'
        ]

        if any(w in texto_lower for w in palavras_dados):
            print("⚡ Modo RAG: Focado em Especificações Técnicas")
            return " especificações técnicas ficha técnica tabela dados valores dimensões"
            
        elif any(w in texto_lower for w in palavras_acao):
            print("🔧 Modo RAG: Focado em Procedimentos de Manutenção")
            return " procedimento passo a passo instrução como fazer manutenção manual proprietário"
            
        print("💬 Modo RAG: Busca Genérica")
        return ""

    def processar_pergunta(self, db, user_id, moto_id, pergunta_texto):
        # 1. Recupera os dados da Moto
        moto = db.query(Moto).filter(Moto.id == moto_id).first()
        
        if not moto:
            return "Erro: Moto não encontrada no banco de dados."

        # Define a collection/nome baseada no modelo
        nome_para_busca = moto.modelo 
        print(f"🤖 RAG Iniciado | Moto: {moto.marca} {moto.modelo} | Pergunta: '{pergunta_texto}'")

        # 2. INTELIGÊNCIA DE BUSCA (Query Expansion)
        sufixo_busca = self._identificar_intencao(pergunta_texto)
        termo_de_busca = pergunta_texto + sufixo_busca

        # 3. Busca no ChromaDB
        try:
            contexto_list = self.vector_store.buscar_similaridade(termo_de_busca, nome_para_busca)
        except Exception as e:
            print(f"❌ Erro ao consultar Vector Store: {e}")
            contexto_list = []

        # Tratamento para quando não há contexto
        if not contexto_list:
            print("⚠️ AVISO: Nenhum contexto encontrado. A IA responderá com cautela.")
            contexto_str = "Nenhuma informação específica encontrada no manual para este termo."
            aviso_sem_contexto = " (Nota: Não encontrei trechos exatos no manual sobre isso, vou tentar ajudar com conhecimento geral, mas verifique com um mecânico)."
        else:
            contexto_str = "\n---\n".join(contexto_list)
            aviso_sem_contexto = ""

        # 4. Prompt Engineering Aprimorado
        prompt_sistema = f"""
        Você é o Motopilot, um assistente mecânico especialista e prestativo.
        Você está respondendo dúvidas sobre a moto: **{moto.marca} {moto.modelo}**.

        REGRAS RIGÍDAS:
        1. Use **EXCLUSIVAMENTE** o CONTEXTO DO MANUAL fornecido abaixo para responder.
        2. Se a informação não estiver no contexto, diga: "Desculpe, essa informação específica não consta no manual que tenho acesso." (Não invente valores).
        3. Formate a resposta usando **Markdown** (negrito para peças/valores, listas para passos).
        4. Seja direto, técnico, mas fácil de entender.
        5. Se houver tabelas de manutenção ou especificações no contexto, cite os valores exatos.

        CONTEXTO DO MANUAL:
        {contexto_str}
        """

        # 5. Geração da Resposta
        try:
            # Envia a pergunta original, o prompt cuida do contexto
            resposta_ia = self.llm_client.generate(prompt_sistema, pergunta_texto)
            
            # Adiciona aviso se não houve contexto recuperado (opcional)
            if aviso_sem_contexto and "Desculpe" not in resposta_ia:
                resposta_ia += f"\n\n_{aviso_sem_contexto}_"

        except Exception as e:
            print(f"❌ Erro na geração da LLM: {e}")
            return "Ocorreu um erro ao processar sua resposta com a Inteligência Artificial."

        # 6. Salva o Histórico
        try:
            log = ChatLog(
                user_id=user_id,
                moto_id=moto_id,
                pergunta=pergunta_texto,
                resposta_ia=resposta_ia
            )
            db.add(log)
            db.commit()
        except Exception as e:
            db.rollback() # Importante: desfaz a transação em caso de erro
            print(f"❌ Erro ao salvar log no banco: {e}")

        return resposta_ia

rag_orchestrator = RagOrchestrator()