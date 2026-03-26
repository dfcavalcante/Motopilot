from collections import Counter
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from app.schemas.report_schema import ReportBase, ReportFilter, ReportResponse, ReportUpdate
from app.models.report_model import Report
from app.models.moto_model import Moto


'''
Camada de serviço responsável pelo relatórios
Criar, excluir, arquivar, alterar, listar, filtrar, exportar
'''

class ReportService():
    @staticmethod
    def _query_com_relacoes():
        return select(Report).options(
            joinedload(Report.moto).joinedload(Moto.modelo_moto)
        )

    @staticmethod
    def criar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportResponse:
        relatorio_dict = relatorio_data.model_dump()
        if relatorio_dict.get("pecas") is not None:
            relatorio_dict["pecas"] = ", ".join(relatorio_dict["pecas"])

        # Ao finalizar com relatório, a moto passa para concluída.
        moto = db.get(Moto, relatorio_dict.get("moto_id"))
        if moto:
            moto.estado = "Concluída"

        db_relatorio = Report(**relatorio_dict)

        db.add(db_relatorio)
        db.commit()
        return db.scalars(
            ReportService._query_com_relacoes().where(Report.id == db_relatorio.id)
        ).first()

    @staticmethod
    def buscar_relatorio_por_id(db: Session, report_id: int):
        return db.scalars(
            ReportService._query_com_relacoes().where(Report.id == report_id)
        ).first()

    @staticmethod
    def listar_relatorios(db: Session, filtros: ReportFilter):
        query = ReportService._query_com_relacoes()

        if filtros.moto_id:
            query = query.where(Report.moto_id == filtros.moto_id)
        if filtros.cliente_id:
            query = query.where(Report.cliente_id == filtros.cliente_id)
        if filtros.mecanicos:
            query = query.where(Report.mecanicos.contains(filtros.mecanicos))

        # Paginação
        offset = (filtros.page - 1) * filtros.per_page
        query = query.offset(offset).limit(filtros.per_page)

        relatorios = db.scalars(query).all()
        for r in relatorios:
            if r.status is None:
                r.status = "Pendente"
        return relatorios

    @staticmethod
    def deletar_relatorio(db: Session, report_id: int):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        if not db_relatorio:
            return None
        db.delete(db_relatorio)
        db.commit()
        return db_relatorio

    @staticmethod
    def concluir_relatorio(db: Session, report_id: int):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        if not db_relatorio:
            return None
        db_relatorio.status = "Concluído"
        db.commit()
        return db.scalars(
            ReportService._query_com_relacoes().where(Report.id == report_id)
        ).first()
        
    @staticmethod
    def atualizar_relatorio(db: Session, report_id: int, relatorio_data: ReportUpdate):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        if not db_relatorio:
            return None

        relatorio_dict = relatorio_data.model_dump(exclude_unset=True)
        if "pecas" in relatorio_dict and relatorio_dict["pecas"] is not None:
            relatorio_dict["pecas"] = ", ".join(relatorio_dict["pecas"])
        for key, value in relatorio_dict.items():
            setattr(db_relatorio, key, value)

        db.commit()
        return db.scalars(
            ReportService._query_com_relacoes().where(Report.id == report_id)
        ).first()

    @staticmethod
    def graficos_relatorio(db: Session):
        COLORS = {"Pendente": "#FFBB28", "Concluído": "#00C49F"}
        LABELS = {"Pendente": "Pendentes", "Concluído": "Concluídos"}
        results = db.execute(
            select(Report.status, func.count(Report.id).label("total"))
            .where(Report.status.in_(["Pendente", "Concluído"]))
            .group_by(Report.status)
        ).all()
        return [
            {
                "name": LABELS.get(r.status, r.status),
                "value": r.total,
                "color": COLORS.get(r.status, "#0088FE"),
            }
            for r in results
        ]

    @staticmethod
    def graficos_pecas(db: Session):
        reports = db.scalars(select(Report).where(Report.pecas.isnot(None))).all()
        counter = Counter()
        for report in reports:
            if report.pecas:
                pecas = [p.strip() for p in report.pecas.split(",") if p.strip()]
                counter.update(pecas)
        top_pecas = counter.most_common(12)
        # Tons de vermelho profissional, do mais escuro ao mais claro
        COLORS = ["#7f0000", "#990000", "#b20000", "#cc0000", "#e50000",
                  "#ff0000", "#ff1919", "#ff3232", "#ff4c4c", "#ff6666", "#ff7f7f", "#ff9999"]
        return [
            {"name": name, "value": count, "color": COLORS[i % len(COLORS)]}
            for i, (name, count) in enumerate(top_pecas)
        ]
    
    @staticmethod
    def aprovar_relatorio(db: Session, report_id: int):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        if not db_relatorio:
            return None
        
        db_relatorio.status = "Aprovado"
        db.commit()
        return db.scalars(
            ReportService._query_com_relacoes().where(Report.id == report_id)
        ).first()

    @staticmethod
    def atualizar_imagem(db: Session, report_id: int, caminho_imagem: str):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        if not db_relatorio:
            return None
        db_relatorio.imagem_path = caminho_imagem
        db.commit()
        return db.scalars(
            ReportService._query_com_relacoes().where(Report.id == report_id)
        ).first()

    @staticmethod
    def arquivar_relatorio(db: Session, report_id: int):
        # TODO: implementar lógica de arquivamento (campo is_archived, etc.)
        pass

    @staticmethod
    def exportar_relatorios(db: Session, report_id: int):
        # TODO: implementar lógica de exportação (PDF, CSV, etc.)
        pass
