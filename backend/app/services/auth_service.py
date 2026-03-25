from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user_model import User
from app.schemas.user_schema import UserLogin
from app.services.security_service import verify_password
from app.services.jwt_service import create_access_token


class Auth_service:
    def login_user(self, db: Session, user_credentials: UserLogin) -> dict:
        """
        Valida credenciais e retorna um dicionário com access_token e dados do usuário.
        """
        user = db.query(User).filter(User.email == user_credentials.email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        senha_do_banco = str(user.senha)

        if not verify_password(user_credentials.senha, senha_do_banco):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )

        # Gerar JWT com o ID do usuário
        access_token = create_access_token(data={"sub": str(user.id)})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }