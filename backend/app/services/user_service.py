from sqlalchemy.orm import Session
from typing import cast
from app.models.user_model import User
from app.schemas.user_schema import UserBase, UserUpdate
from sqlalchemy import select
from app.services.notification_service import NotificationService
from app.services.security_service import get_password_hash

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.notificacao = NotificationService(db)
        
    def create_user(self, user_schema: UserBase):
        user_exists = self.db.query(User).filter(User.email == user_schema.email).first()
        if user_exists:
            raise ValueError("Email já cadastrado no sistema.")

        matricula_exists = self.db.query(User).filter(User.matricula == user_schema.matricula).first()
        if matricula_exists:
            raise ValueError(f"A matrícula '{user_schema.matricula}' já está em uso.")
        
        senha_criptografada = get_password_hash(user_schema.senha)
        
        new_user = User(
            nome=user_schema.nome,
            email=user_schema.email,
            senha=senha_criptografada,
            matricula=user_schema.matricula,
            funcao=user_schema.funcao
        )
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        self.notificacao.notificar_usuario("criado", cast(int, new_user.id), cast(str, new_user.nome))
        return new_user
    
    def update_user(self, user_id: int, user_update: UserUpdate):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Usuário não encontrado.")
        
        if user_update.email and user_update.email != user.email:
            email_exists = self.db.query(User).filter(User.email == user_update.email).first()
            if email_exists:
                raise ValueError("Email já cadastrado no sistema.")
        
        if user_update.matricula and user_update.matricula != user.matricula:
            matricula_exists = self.db.query(User).filter(User.matricula == user_update.matricula).first()
            if matricula_exists:
                raise ValueError(f"A matrícula '{user_update.matricula}' já está em uso.")
        
        payload = user_update.model_dump(exclude_unset=True)

        # Sempre persiste senha como hash.
        if "senha" in payload and payload["senha"]:
            payload["senha"] = get_password_hash(payload["senha"])

        for field, value in payload.items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        self.notificacao.notificar_usuario("atualizado", user_id, cast(str, user.nome))
        
        return user
    
    def deletar_usuario(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Usuário não encontrado.")
        
        self.db.delete(user)
        self.db.commit()
        self.notificacao.notificar_usuario("deletado", cast(int, user.id), cast(str, user.nome))
        return True
    
    # --- VERIFICAÇÕES ---
    def verificar_matricula_existente(self, db: Session,matricula: str) -> bool:
        """Verifica se um número de série já existe no banco de dados. Verificação pro frontend"""
        user_existente = db.scalars(
            select(User).where(User.matricula == matricula)
        ).first()
        return user_existente is not None
    
    def verificar_email_existente(self, db: Session,email: str) -> bool:
        """Verifica se um número de série já existe no banco de dados. Verificação pro frontend"""
        user_existente = db.scalars(
            select(User).where(User.email == email)
        ).first()
        return user_existente is not None