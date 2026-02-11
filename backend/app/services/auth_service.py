from sqlalchemy.orm import Session
from sqlalchemy import func, select, update, delete
from app.models.user_model import User
from app.services.security_service import get_password_hash
from app.schemas.user_schema import UserBase, UserResponse
from typing import List, Optional

'''
Camada de serviço que será responsável pela lógica de negócios da Moto
Incluindo CRUD e listagem de Motos
'''

#TODO: falta implementar o login_user, verificar se o usuario existe, logar ele, autenticar basicamente

class Auth_service:
    @staticmethod
    def register_user(user_data: UserBase, db:Session) -> UserResponse:
        # --- Ponto CRÍTICO: Geração do Hash na Rota ---
        hashed_password = get_password_hash(user_data.senha) 

        # 1. Cria a instância do Modelo (User) usando o HASH
        new_user = User(
            nome=user_data.nome,
            email=user_data.email,
            hashed_password=hashed_password, # Armazenando o HASH, não a senha original
        )
        
        db.add(new_user)
        db.commit()
        return new_user

    def get_user_email(email: str, db: Session) -> Optional[User]:
        user_email = db.query(User).filter(User.email == email).first()
        return user_email
    
    def login_user(email:str, db:Session) ->UserResponse:
        pass


    