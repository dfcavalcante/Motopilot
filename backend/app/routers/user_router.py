from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# --- CRIAR USUÁRIO (Cadastro de Engenheiro/Gerente) ---
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verifica se email já existe
    user_exists = db.query(User).filter(User.email == user.email).first()
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email já cadastrado no sistema."
        )
    
    # Criação simples (Sprint 1: Senha em texto plano ou hash simples)
    # TODO: Implementar bcrypt para hash de senha na próxima sprint
    new_user = User(
        nome=user.nome,
        email=user.email,
        senha_hash=user.senha, # Em produção, use hash aqui!
        cargo=user.cargo
    )
    
    # 3. Salva no banco
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

# --- LISTAR USUÁRIOS (Para o Gerente ver a equipe) ---
@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# --- BUSCAR POR ID ---
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

# --- DELETAR USUÁRIO ---
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    db.delete(user)
    db.commit()
    return None