import sys
import os

# Adiciona o diretório atual ao path para importar os módulos 'app'
sys.path.append(os.getcwd())

from app.database.connections import SessionLocal, engine, Base
from app.models.user_model import User, UserRole
from app.models.moto_model import Moto
from app.models.chat_model import ChatLog

# --- CONFIGURAÇÃO INICIAL ---
# Recria as tabelas para garantir que o teste comece limpo
print("Preparando ambiente de teste...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Tabelas recriadas com sucesso.")

def testar_fluxo_inteligencia_artificial():
    db = SessionLocal()

    try:
        # 1. CENÁRIO: O Engenheiro 'Carlos' chega para trabalhar
        # Ele é quem vai operar a IA. O gerente não entra aqui.
        print("\n1. Criando o Operador (Engenheiro)...")
        from app.services.security_service import get_password_hash
        engenheiro = User(
            nome="Carlos Silva",
            email="carlos.tec@oficina.com",
            senha=get_password_hash("Senha123"),
            cargo=UserRole.ENGINEER # Define que ele é técnico
        )
        db.add(engenheiro)
        db.commit()
        db.refresh(engenheiro)

        # 2. CENÁRIO: Uma moto chega na oficina
        # A IA precisa ter o manual dessa moto no banco.
        print("2. Registrando a Moto no sistema...")
        moto = Moto(
            marca="Kawasaki",
            modelo="Ninja ZX-6R",
            ano=2024,
            manual_pdf_path="manuals/kawasaki_ninja_zx6r.pdf"
        )
        db.add(moto)
        db.commit()
        db.refresh(moto)

        # 3. CENÁRIO: O Engenheiro consulta a IA (O Chatbot)
        # ISSO É O QUE O RAG VAI FAZER AUTOMATICAMENTE
        print("Simulando interação: Engenheiro -> IA...")
        
        log_interacao = ChatLog(
            user_id=engenheiro.id,  # Quem perguntou (Carlos)
            moto_id=moto.id,        # Sobre qual manual (Ninja)
            
            # A pergunta técnica do Carlos
            pergunta="Qual o procedimento de aperto do cabeçote?",
            
            # A resposta que o LLM (Mistral/Ollama) gerou
            resposta_ia="O aperto deve ser feito em duas etapas: primeiro a 20Nm, depois 90 graus."
        )
        
        db.add(log_interacao)
        db.commit()
        db.refresh(log_interacao)

        # 4. VALIDAÇÃO: O que ficou gravado no Banco?
        print("\n--- RELATÓRIO DO TESTE ---")
        print(f"ID da Sessão: {log_interacao.id}")
        print(f"Quem operou a IA: {log_interacao.user.nome} (Cargo: {log_interacao.user.cargo})")
        print(f"Manual consultado: {log_interacao.moto.marca} {log_interacao.moto.modelo}")
        print(f"Pergunta: '{log_interacao.pergunta}'")
        print(f"Resposta da IA: '{log_interacao.resposta_ia}'")
        
        print("\nO banco registrou corretamente a consulta técnica.")

    except Exception as e:
        print(f"\nFALHA NO TESTE: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    testar_fluxo_inteligencia_artificial()