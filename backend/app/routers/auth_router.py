from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import UserLogin, UserResponse, LoginResponse
from app.services.auth_service import Auth_service
from app.services.jwt_service import get_current_user
from app.models.user_model import User

router = APIRouter(tags=["Auth"])
auth_service = Auth_service()

@router.post("/login", response_model=LoginResponse)
def login_user_endpoint(user: UserLogin, db: Session = Depends(get_db)):
    """Realiza login e retorna JWT + dados do usuário."""
    result = auth_service.login_user(db, user)
    return result

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Retorna os dados do usuário autenticado a partir do token JWT."""
    return current_user