import asyncio
from sqlalchemy import update
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
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

    def criar_notificacao(self, payload: NotificationCreate) -> Notification:
        db_notification = Notification(**payload.model_dump())
        self.db.add(db_notification)
        self.db.commit()
        self.db.refresh(db_notification)

        response_payload = NotificationResponse.model_validate(db_notification).model_dump(mode="json")
        notification_broadcast_manager.broadcast_nowait(response_payload)

        return db_notification
    
    def listar_notificacoes(self, user, limite: int = 50, nao_lido: bool = False) -> list[Notification]:
        query = select(Notification).order_by(Notification.criado_em.desc())
        
        # Filtro de acesso
        query = query.filter(
            ((Notification.user_id == None) & (Notification.perfil_destino == None)) |
            (Notification.user_id == user.id) |
            (Notification.perfil_destino == user.funcao)
        )

        if nao_lido:
            query = query.where(Notification.lido.is_(False))

        #Limite de notificações que duvido que vai ser necessário, mas é bom ter um limite pra evitar sobrecarga no frontend
        limite_notificacoes = max(1, min(limite, 200)) 
        return list(self.db.scalars(query.limit(limite_notificacoes)).all())

    def marcar_lido(self, notificacao_id: int) -> Notification | None:
        notificacao = self.db.get(Notification, notificacao_id)
        if not notificacao:
            return None

        if not bool(notificacao.lido):
            setattr(notificacao, "lido", True)
            self.db.add(notificacao)
            self.db.commit()
            self.db.refresh(notificacao)

        return notificacao

    def marcar_todas_lidas(self, user) -> int:
        try:
            stmt = (
                update(Notification)
                .where(Notification.lido.is_(False))
                .where(
                    ((Notification.user_id == None) & (Notification.perfil_destino == None)) |
                    (Notification.user_id == user.id) |
                    (Notification.perfil_destino == user.funcao)
                )
                .values(lido=True)
            )
            
            result = self.db.execute(stmt)
            self.db.commit()

            # rowcount pode nao estar tipado em algumas versoes do SQLAlchemy/Pylance.
            quantidade = getattr(result, "rowcount", 0)
            return int(quantidade or 0)

        except SQLAlchemyError as e:
            self.db.rollback() 
            print(f"Erro ao marcar notificações: {e}") 
            return 0

    def notificar_moto(self, action: str, moto_id: int, moto_marca: str, moto_modelo: str) -> Notification:
        return self.criar_notificacao(
            NotificationCreate(
                tipo_entidade="moto",
                id_entidade=moto_id,
                atividade=action,
                titulo=f"Moto {action}",
                mensagem=f"A moto {moto_marca} {moto_modelo} foi {action}.",
                perfil_destino="gerente",
            )
        )

    def notificar_usuario(self, action: str, user_id: int, user_nome: str) -> Notification:
        return self.criar_notificacao(
            NotificationCreate(
                tipo_entidade="user",
                id_entidade=user_id,
                atividade=action,
                titulo=f"Usuário {action}",
                mensagem=f"O usuário {user_nome} foi {action}.",
                perfil_destino="gerente",
            )
        )

    def notificar_atribuicao_mecanico(
        self,
        moto_id: int,
        moto_marca: str,
        moto_modelo: str,
        mecanico_nome: str,
        mecanico_id: int,
    ) -> Notification:
        return self.criar_notificacao(
            NotificationCreate(
                tipo_entidade="moto",
                id_entidade=moto_id,
                atividade="atribuida",
                titulo="Moto atribuída",
                mensagem=f"A moto {moto_marca} {moto_modelo} foi atribuída para {mecanico_nome}.",
                user_id=mecanico_id,
            )
        )
