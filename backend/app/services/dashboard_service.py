from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import Counter

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
        
        motos_em_manutencao = db.query(func.count(Moto.id)).filter(Moto.estado == "Em Manutenção").scalar() or 0
        motos_disponiveis = db.query(func.count(Moto.id)).filter(Moto.estado == "Ativa").scalar() or 0
        motos_concluidas = db.query(func.count(Moto.id)).filter(Moto.estado == "Concluída").scalar() or 0

        relatorios_pendentes = db.query(func.count(Report.id)).filter(Report.status == "pendente").scalar() or 0
        relatorios_concluidos = db.query(func.count(Report.id)).filter(Report.status == "concluido" or Report.status == "Concluído").scalar() or 0
        total_manutencoes = db.query(func.count(Report.id)).scalar() or 0

        # Motos com status que exigem ação e que ainda não possuem relatório de conclusão
        motos_pendentes = (
            db.query(func.count(Moto.id))
            .filter(Moto.estado.in_(["Aguardando", "Manutenção", "Ativa"]))
            .filter(~Moto.relatorios.any())
            .scalar() or 0
        )

        # Buscar peças para montar o ranking
        relatorios_com_pecas = db.query(Report.pecas).filter(Report.pecas != None, Report.pecas != "").all()
        contador_pecas = Counter()
        
        for r in relatorios_com_pecas:
            # Assuming 'pecas' is stored as comma-separated values
            pecas_list = [p.strip().capitalize() for p in r.pecas.split(',') if p.strip()]
            contador_pecas.update(pecas_list)
            
        # Converter para o formato { "nome": str, "quantidade": int } e já vem ordenado via most_common()
        ranking_pecas = [
            {"nome": peca, "quantidade": qtd}
            for peca, qtd in contador_pecas.most_common()
        ]

        return DashboardGerenteResponse(
            total_usuarios=total_usuarios,
            total_motos=total_motos,
            motos_em_manutencao=motos_em_manutencao,
            motos_disponiveis=motos_disponiveis,
            motos_concluidas=motos_concluidas,
            relatorios_pendentes=relatorios_pendentes,
            relatorios_concluidos=relatorios_concluidos,
            total_manutencoes_realizadas=total_manutencoes,
            motos_aguardando_manutencao=motos_pendentes,
            pecas=ranking_pecas
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
            .filter(Moto.estado.in_(["Aguardando", "Manutenção"]))
            .scalar() or 0
        )

        # Motos cujo relatório de conclusão associado a elas foi gerado por esse mecânico
        # Simplificação: Mecânicos no relatório é uma string, e buscamos se o nome ou identificador dele gerou.
        # Caso relatórios estejam ligados apenas à moto e não armazenem o ID do mecânico que criou.
        # Vamos assumir: Moto atribuída e status Concluída conta como trabalho feito dele.
        motos_manutencao_feita = (
            db.query(func.count(Moto.id))
            .filter(Moto.mecanico_id == mecanico_id)
            .filter(Moto.estado == "Concluída")
            .scalar() or 0
        )

        # Relatórios gerados em motos atribuídas a este mecânico
        relatorios_feitos = (
            db.query(func.count(Report.id))
            .join(Moto, Report.moto_id == Moto.id)
            .filter(Moto.mecanico_id == mecanico_id)
            .scalar() or 0
        )

        return DashboardMecanicoResponse(
            motos_atribuidas=motos_atribuidas,
            motos_manutencao_feita=motos_manutencao_feita,
            relatorios_feitos=relatorios_feitos
        )
