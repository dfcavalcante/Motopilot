from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    id: int
    tipo_entidade: str
    id_entidade: int | None = None
    atividade: str
    titulo: str
    mensagem: str
    lido: bool
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationCreate(BaseModel):
    tipo_entidade: str
    id_entidade: int | None = None
    atividade: str
    titulo: str
    mensagem: str
