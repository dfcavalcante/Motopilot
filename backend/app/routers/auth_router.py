from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import UserLogin, UserResponse 
from app.services.auth_service import Auth_service

router = APIRouter(tags=["Auth"])
auth_service = Auth_service()

@router.post("/login", response_model=UserResponse)
def login_user_endpoint(user: UserLogin, db: Session = Depends(get_db)):
    
    logged_user = auth_service.login_user(db, user)
    return logged_user