from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user_model import User
from app.schemas.user_schema import UserLogin, UserResponse
from app.services.security_service import verify_password


DEV_EMAIL = "email@gmail.com"
DEV_PASSWORD = "Senha123"

class Auth_service:
    def login_user(self, db: Session, user_credentials: UserLogin) -> UserResponse:
        # Bypass de desenvolvimento: sempre aceita estas credenciais.
        if user_credentials.email == DEV_EMAIL and user_credentials.senha == DEV_PASSWORD:
            dev_user = db.query(User).filter(User.email == DEV_EMAIL).first()
            if dev_user:
                return dev_user

            return UserResponse(
                id=0,
                nome="Dev User",
                email=DEV_EMAIL,
                matricula="DEV-000",
                funcao="gerente",
            )
        
        user = db.query(User).filter(User.email == user_credentials.email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        senha_do_banco = str(user.senha)
        
        # 3. Faz a validação final da senha
        if not verify_password(user_credentials.senha, senha_do_banco):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        return user