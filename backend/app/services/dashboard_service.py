from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.user_model import User
from app.models.moto_model import Moto
from app.models.report_model import Report
from app.schemas.dashboard_schema import DashboardGerenteResponse, DashboardMecanicoResponse


class DashboardService:

    @staticmethod
    def get_dashboard_gerente(db: Session) -> DashboardGerenteResponse:
        """
        Retorna as métricas globais da oficina para o Gerente:
        - Total de usuários cadastrados
        - Total de motos cadastradas
        - Total de manutenções realizadas (contagem de relatórios)
        - Motos aguardando manutenção (estado 'Aguardando' ou 'Manutenção' sem relatório)
        """
        total_usuarios = db.query(func.count(User.id)).scalar() or 0
        total_motos = db.query(func.count(Moto.id)).scalar() or 0
        total_manutencoes = db.query(func.count(Report.id)).scalar() or 0

        # Motos com status que exigem ação e que ainda não possuem relatório de conclusão
        motos_pendentes = (
            db.query(func.count(Moto.id))
            .filter(Moto.estado.in_(["Aguardando", "Manutenção", "Ativa"]))
            .filter(~Moto.relatorios.any())
            .scalar() or 0
        )

        return DashboardGerenteResponse(
            total_usuarios=total_usuarios,
            total_motos=total_motos,
            total_manutencoes_realizadas=total_manutencoes,
            motos_aguardando_manutencao=motos_pendentes
        )

    @staticmethod
    def get_dashboard_mecanico(db: Session, mecanico_id: int) -> DashboardMecanicoResponse:
        """
        Retorna as métricas individuais para o Mecânico:
        - Motos atribuídas a ele (onde mecanico_id == seu ID e estado != Concluída)
        - Manutenções concluídas por ele (relatórios associados a motos dele)
        """
        # Motos atribuídas ao mecânico que ainda precisam de ação
        motos_atribuidas = (
            db.query(func.count(Moto.id))
            .filter(Moto.mecanico_id == mecanico_id)
            .filter(Moto.estado != "Concluída")
            .scalar() or 0
        )

        # Relatórios gerados em motos atribuídas a este mecânico
        manutencoes_realizadas = (
            db.query(func.count(Report.id))
            .join(Moto, Report.moto_id == Moto.id)
            .filter(Moto.mecanico_id == mecanico_id)
            .scalar() or 0
        )

        return DashboardMecanicoResponse(
            motos_atribuidas=motos_atribuidas,
            manutencoes_realizadas=manutencoes_realizadas
        )
