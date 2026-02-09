from sqlalchemy.orm import Session
from app.models.user_model import User
from app.schemas.user_schema import UserBase, UserUpdate

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_schema: UserBase):
        user_exists = self.db.query(User).filter(User.email == user_schema.email).first()
        if user_exists:
            raise ValueError("Email já cadastrado no sistema.")

        matricula_exists = self.db.query(User).filter(User.matricula == user_schema.matricula).first()
        if matricula_exists:
            raise ValueError(f"A matrícula '{user_schema.matricula}' já está em uso.")
        
        new_user = User(
            nome=user_schema.nome,
            email=user_schema.email,
            senha=user_schema.senha, #Tem que criptografar isso depois, mas por enquanto tá ok
            matricula=user_schema.matricula,
            funcao=user_schema.funcao
        )
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        
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
        
        for field, value in user_update.dict(exclude_unset=True).items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user