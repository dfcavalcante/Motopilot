from sqlalchemy.orm import Session
from datetime import datetime

# Imports ajustados para rodar da raiz 'backend'
from llm.services.vector_store import vector_store
from llm.services.llm_client import llm_client
from app.models.moto_model import Moto
from app.models.chat_model import ChatLog

class RagOrchestrator:
    def processar_pergunta(self, db: Session, user_id: int, moto_id: int, pergunta_texto: str) -> str:
        
        # 1. Busca a moto no banco SQL
        moto = db.query(Moto).filter(Moto.id == moto_id).first()

        if not moto:
            return "Erro: Moto não encontrada no sistema."
        
        # ==============================================================================
        # ⚠️ A VARIÁVEL É CRIADA AQUI (LINHA CRUCIAL)
        # Ela junta Marca + Modelo para saber qual PDF buscar (ex: "Honda Biz 110i")
        # ==============================================================================
        nome_modelo_filtro = f"{moto.marca} {moto.modelo}".strip()
        
        print(f"🤖 RAG Iniciado | Buscando no manual: '{nome_modelo_filtro}'")

        # 2. Busca no ChromaDB usando a variável criada acima
        trechos_relevantes = vector_store.buscar_similaridade(
            pergunta=pergunta_texto,
            modelo_moto=nome_modelo_filtro, # <--- Usa aqui
            k=4
        )

        # Se não achou nada, retorna aviso (mas não trava)
        if not trechos_relevantes:
            contexto_unificado = "Nenhuma informação específica encontrada no manual."
        else:
            contexto_unificado = "\n---\n".join(trechos_relevantes)

        # 3. Monta o Prompt usando a variável novamente
        prompt_final = f"""Você é o Motopilot, assistente técnico de motos.
        
        INSTRUÇÕES:
        Use APENAS o contexto abaixo do manual da {nome_modelo_filtro} para responder.
        Se não souber, diga "Não consta no manual".
        
        CONTEXTO:
        {contexto_unificado}

        PERGUNTA:
        {pergunta_texto}
        """

        # 4. Gera a resposta
        resposta_ia = llm_client.gerar_resposta(prompt_final)

        # 5. Salva no Banco SQL
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
        except Exception as e:
            print(f"⚠️ Erro ao salvar histórico: {e}")
            db.rollback()

        return resposta_ia

rag_orchestrator = RagOrchestrator()