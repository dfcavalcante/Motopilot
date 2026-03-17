from sqlalchemy.orm import Session
from sqlalchemy import select
from app.schemas.report_schema import ReportBase, ReportFilter, ReportResponse, ReportUpdate
from app.models.report_model import Report

'''
Camada de serviço responsável pelo relatórios
Criar, excluir, arquivar, alterar, listar, filtrar, exportar
'''

class ReportService():
    @staticmethod
    def criar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportResponse:
        relatorio_dict = relatorio_data.model_dump()
        if relatorio_dict.get("pecas") is not None:
            relatorio_dict["pecas"] = ", ".join(relatorio_dict["pecas"])
        db_relatorio = Report(**relatorio_dict)

        db.add(db_relatorio)
        db.commit()
        db.refresh(db_relatorio)

        return db_relatorio

    @staticmethod
    def buscar_relatorio_por_id(db: Session, report_id: int):
        return db.scalars(select(Report).where(Report.id == report_id)).first()

    @staticmethod
    def listar_relatorios(db: Session, filtros: ReportFilter):
        query = select(Report)

        if filtros.moto_id:
            query = query.where(Report.moto_id == filtros.moto_id)
        if filtros.cliente_id:
            query = query.where(Report.cliente_id == filtros.cliente_id)
        if filtros.mecanicos:
            query = query.where(Report.mecanicos.contains(filtros.mecanicos))

        # Paginação
        offset = (filtros.page - 1) * filtros.per_page
        query = query.offset(offset).limit(filtros.per_page)

        return list(db.scalars(query).all())

    @staticmethod
    def deletar_relatorio(db: Session, report_id: int):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        if not db_relatorio:
            return None
        db.delete(db_relatorio)
        db.commit()
        return db_relatorio

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
        db.refresh(db_relatorio)
        return db_relatorio

    @staticmethod
    def aprovar_relatorio(db: Session, report_id: int):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        if not db_relatorio:
            return None
        
        db_relatorio.status = "Aprovado"
        db.commit()
        db.refresh(db_relatorio)
        return db_relatorio

    @staticmethod
    def arquivar_relatorio(db: Session, report_id: int):
        # TODO: implementar lógica de arquivamento (campo is_archived, etc.)
        pass

    @staticmethod
    def exportar_relatorios(db: Session, report_id: int):
        # TODO: implementar lógica de exportação (PDF, CSV, etc.)
        pass
