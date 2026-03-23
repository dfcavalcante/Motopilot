from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard_schema import DashboardGerenteResponse, DashboardMecanicoResponse
from app.services.jwt_service import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

dashboard_service = DashboardService()


@router.get("/gerente", response_model=DashboardGerenteResponse)
def dashboard_gerente(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Dashboard do Gerente — métricas globais da oficina:
    total de usuários, motos, manutenções realizadas e motos pendentes.
    """
    return dashboard_service.get_dashboard_gerente(db)


@router.get("/mecanico/{mecanico_id}", response_model=DashboardMecanicoResponse)
def dashboard_mecanico(mecanico_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Dashboard do Mecânico — métricas individuais:
    motos atribuídas a ele e manutenções concluídas por ele.
    """
    return dashboard_service.get_dashboard_mecanico(db, mecanico_id)
