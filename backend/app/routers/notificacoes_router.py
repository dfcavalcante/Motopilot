from fastapi import APIRouter, Depends
from app.services.notification_service import NotificationService
from app.schemas.notification_schema import NotificationCreate, NotificationResponse
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/notificação", tags=['Notificação'])

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

@router.patch("/marcar_lido/{notification_id}", response_model=NotificationResponse)
def marcar_lido_endpoint(notification_id: int, db: Session = Depends(get_db)):
    notification_service = NotificationService(db)
    notificacao = notification_service.marcar_lido(notification_id)
    return notificacao

@router.patch("/marcar_todas_lidas", response_model=NotificationResponse)
def marcar_todas_lidas_endpoint(db: Session = Depends(get_db)):
    notification_service = NotificationService(db)
    quantidade = notification_service.marcar_todas_lidas()
    return {"quantidade": quantidade}