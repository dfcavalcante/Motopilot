from fastapi import APIRouter, Depends, HTTPException, status
from app.services.notification_service import NotificationService
from app.schemas.notification_schema import NotificationCreate, NotificationResponse
from app.models.notification_model import Notification
from app.database import get_db
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/notificacoes", tags=['Notificações'])

class MarcarTodasLidasResponse(BaseModel):
    quantidade: int

@router.post("/", response_model=NotificationResponse)
def criar_notificacao_endpoint(notificacao: NotificationCreate, db: Session = Depends(get_db)):
    notification_service = NotificationService(db)
    nova_notificacao = notification_service.criar_notificacao(notificacao)
    return nova_notificacao

#Listar notificações do usuário sem filtros
@router.get("/listar", response_model=list[NotificationResponse])
def listar_notificacoes_endpoint( db: Session = Depends(get_db)):
    notification_service = NotificationService(db)
    listar_notificacoes = notification_service.listar_notificacoes()
    return listar_notificacoes

@router.patch("/{notification_id}/marcar_como_lida", response_model=NotificationResponse)
def marcar_lido_endpoint(notification_id: int, db: Session = Depends(get_db)):
    notification_service = NotificationService(db)
    notificacao = notification_service.marcar_lido(notification_id)
    if not notificacao:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notificação não encontrada")
    return notificacao

@router.patch("/marcar_todas_lidas", response_model=MarcarTodasLidasResponse)
def marcar_todas_lidas_endpoint(db: Session = Depends(get_db)):
    notification_service = NotificationService(db)

    quantidade = notification_service.marcar_todas_lidas()
    
    return {"quantidade": quantidade}