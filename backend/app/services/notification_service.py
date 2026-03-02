import asyncio
from typing import Iterable

from fastapi import WebSocket
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.notification_model import Notification
from app.schemas.notification_schema import NotificationCreate, NotificationResponse

# Gerenciador de conexões WebSocket para notificações em tempo real
class NotificationBroadcastManager:
    def __init__(self):
        self.active_connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast(self, payload: dict):
        disconnected: list[WebSocket] = []
        for connection in self.active_connections:
            try:
                await connection.send_json(payload)
            except Exception:
                disconnected.append(connection)

        for dead_connection in disconnected:
            self.disconnect(dead_connection)

    def broadcast_nowait(self, payload: dict):
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return

        loop.create_task(self.broadcast(payload))


notification_broadcast_manager = NotificationBroadcastManager()

# Serviço de notificações
class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def listar_notificacoes(self, limit: int = 50, unread_only: bool = False) -> list[Notification]:
        query = select(Notification).order_by(Notification.criado_em.desc())
        if unread_only:
            query = query.where(Notification.is_read.is_(False))

        limit_value = max(1, min(limit, 200))
        return list(self.db.scalars(query.limit(limit_value)).all())

    def marcar_lido(self, notification_id: int) -> Notification | None:
        notification = self.db.get(Notification, notification_id)
        if not notification:
            return None

        if not notification.is_read:
            notification.is_read = True
            self.db.add(notification)
            self.db.commit()
            self.db.refresh(notification)

        return notification

    #Caso isso seja adicionado no futuro no frontend, tem que falar com o Fernando
    def marcar_todas_lidas(self) -> int:
        notifications = list(self.db.scalars(select(Notification).where(Notification.is_read.is_(False))).all())
        if not notifications:
            return 0

        for item in notifications:
            item.is_read = True
            self.db.add(item)

        self.db.commit()
        return len(notifications)

    def criar_notificacao(self, payload: NotificationCreate) -> Notification:
        db_notification = Notification(**payload.model_dump())
        self.db.add(db_notification)
        self.db.commit()
        self.db.refresh(db_notification)

        response_payload = NotificationResponse.model_validate(db_notification).model_dump(mode="json")
        notification_broadcast_manager.broadcast_nowait(response_payload)

        return db_notification

    def notificar_moto(self, action: str, moto_id: int, moto_label: str) -> Notification:
        action_pt = {
            "created": "criada",
            "updated": "atualizada",
            "deleted": "deletada",
        }.get(action, action)

        return self.criar_notificacao(
            NotificationCreate(
                tipo_entidade="moto",
                id_entidade=moto_id,
                atividade=action,
                titulo=f"Moto {action_pt}",
                mensagem=f"A moto {moto_label} foi {action_pt}.",
            )
        )

    def notificar_usuario(self, action: str, user_id: int, user_label: str) -> Notification:
        action_pt = {
            "created": "criado",
            "updated": "atualizado",
            "deleted": "deletado",
        }.get(action, action)

        return self.criar_notificacao(
            NotificationCreate(
                tipo_entidade="user",
                id_entidade=user_id,
                atividade=action,
                titulo=f"Usuário {action_pt}",
                mensagem=f"O usuário {user_label} foi {action_pt}.",
            )
        )
