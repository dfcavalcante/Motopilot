# Orquestra o fluxo RAG principal
from sqlalchemy.orm import Session
from datetime import datetime

# Importações dos nossos serviços
from services.vector_store import vector_store
from services.llm_client import llm_client
from app.models.moto_model import Moto
from app.models.user_model import User
#from app.models.chat_model import ChatLog

class RagOrchestrator:
    def __init__(self):
        pass

    def processar_pergunta(self, db: Session, user_id: int, moto_id: int, pergunta_texto: str) -> str:
        moto = db.query(Moto).filter(Moto.id == moto_id).first()

        if not moto:
            return "Erro: Moto não encontrada no sistema."
        
        nome_modelo_filtro = f"{moto.marca} {moto.modelo}".strip()
        print(f"🤖 RAG Iniciado | Moto: {nome_modelo_filtro} | Pergunta: {pergunta_texto}")

        #Recuperar Contexto
        trechos_relevantes = vector_store.buscar_similaridade(
            pergunta=pergunta_texto,
            modelo_moto=nome_modelo_filtro
        )

        if not trechos_relevantes:
            return "Desculpe, não encontrei informações específicas sobre a pergunta"
        
        contexto_unificado = "\n---\n".join(trechos_relevantes)

        # Montagem do prompt 
        prompt_final = f"""Você é o Motopilot, um assistente técnico especializado em mecânica de motos.
        Você está auxiliando um mecânico profissional. Seja direto, técnico e preciso.
        
        INSTRUÇÕES:
        1. Use APENAS o contexto fornecido abaixo para responder.
        2. Se a resposta não estiver no contexto, diga "Não consta no manual".
        3. Não invente infromações.

        CONTEXTO DO MANUAL ({nome_modelo_filtro}):
        {contexto_unificado}

        PERGUNTA DO MECÂNICO:
        {pergunta_texto}

        RESPOSTA:
        """

        #Geração da Resposta
        resposta_ia = llm_client.gerar_resposta(prompt_final)

        # Salvar Histórico
        try:
            novo_log = ChatLog(
                user_id=user_id,
                moto_id=moto_id,
                pergunta=pergunta_texto,
                resposta_ia=resposta_ia,
                created_at=datetime.now()
            )
            db.add(novo_log)
            db.commit()
            print("Conversa salva no histórico com sucesso.")
        except Exception as e:
            print(f"Erro ao salvar histórico (mas a resposta será enviada): {e}")
            db.rollback()

            return resposta_ia
        
rag_orchestrator = RagOrchestrator()


         