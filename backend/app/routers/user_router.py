from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserBase, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

#Criação de usuário dos técnicos e adminitradores 
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserBase, db: Session = Depends(get_db)):
    service = UserService(db)

    try:
        return service.create_user(user)
    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(erro)
        )

# --- LISTAR USUÁRIOS (Para o Gerente ver a equipe) ---
@router.get("/listar", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# --- BUSCAR POR ID ---
@router.get("/{user_id}/buscar", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

# --- ATUALIZAR USUÁRIO ---
@router.patch("/{user_id}/atualizar", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    service = UserService(db)
    try:
        return service.update_user(user_id, user_update)
    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(erro)
        )

# --- DELETAR USUÁRIO ---
@router.delete("/{user_id}/deletar", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)
    try:
        service.deletar_usuario(user_id)
    except ValueError as erro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(erro)
        )

# --- VERIFICAÇÕES --- 
@router.get('/check/{matricula}')
def verificar_matricula_endpoint(matricula: str, db: Session = Depends(get_db)):
    """Retorna {"exists": true} se a matrícula já estiver no banco."""
    exists = db.query(User).filter(User.matricula == matricula).first() is not None
    return {"exists": exists}

@router.get('/check-email/{email}')
def verificar_email_endpoint(email: str, db: Session = Depends(get_db)):
    """Retorna {"exists": true} se o email já estiver no banco."""
    exists = db.query(User).filter(User.email == email).first() is not None
    return {"exists": exists}