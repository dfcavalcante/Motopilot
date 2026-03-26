import sys
import os

# Adiciona o diretório atual ao path para garantir que as importações da pasta 'app' funcionem
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user_model import User
from app.services.security_service import get_password_hash

def update_user_password(email: str, new_password: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Erro: Usuário com o e-mail '{email}' não foi encontrado no banco de dados.")
            return

        hashed_password = get_password_hash(new_password)
        user.senha = hashed_password
        db.commit()
        print(f"Sucesso: A senha para '{email}' foi atualizada e salva com criptografia!")
    except Exception as e:
        print(f"Ocorreu um erro ao atualizar a senha: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso correto: python update_password.py <seu_email> <nova_senha>")
        sys.exit(1)
    
    user_email = sys.argv[1]
    user_password = sys.argv[2]
    update_user_password(user_email, user_password)
