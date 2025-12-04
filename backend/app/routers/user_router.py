from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connections import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Verifica se email já existe
    user_exists = db.query(User).filter(User.email == user.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    # 2. Cria o objeto do modelo (Hash de senha seria aqui, mas vamos simplificar por enquanto)
    new_user = User(
        nome=user.nome,
        email=user.email,
        senha_hash=user.senha, # AVISO: Em produção, usar bcrypt aqui!
        cargo=user.cargo
    )
    
    # 3. Salva no banco
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user