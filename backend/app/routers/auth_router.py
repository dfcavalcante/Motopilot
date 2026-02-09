# Trecho de código (na rota /register)

# 1. Importa a ferramenta
from fastapi import APIRouter, HTTPException, Depends, Response
from app.services.security_service import get_password_hash
from app.models.user_model import User
from app.schemas.user_schema import UserBase, UserCreate, UserResponse
from app.services.auth_service import Auth_service
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(tags=["Users"])

auth_service = Auth_service()

# 2. Rota POST de registro
@router.post("/register", response_model= UserResponse)
def register_user_endpoint(user: UserBase, db: Session = Depends(get_db)):
    novo_user = auth_service.register_user(db, user)
    return novo_user

@router.post("/login",response_model=UserResponse)
def login_user_endpoint(user:UserBase, db: Session = Depends(get_db)):
    login_user = auth_service.login_user(db, user)
    return login_user