from sqlalchemy.orm import Session
from app.schemas.report_schema import ReportBase, ReportFilter, ReportResponse, ReportUpdate
from app.models.report_model import Report, ReportBase

'''
Camada de serviço responsável pelo relatórios
Criar, excluir, arquivar, alterar, listar, filtrar, exportar
'''

class ReportService():
    @staticmethod
    def criar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportResponse:
        db_relatorio = Report(**relatorio_data.model_dump()) #converte  o schema

        db.add(db_relatorio)
        db.commit()
        db.refresh(db_relatorio)

        return db_relatorio
    
    def deletar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportBase:
        pass

    def arquivar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportBase:
        pass

    def atualizar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportResponse:
        pass
    
    def buscar_relatorio_por_id(report_id: int):
        pass 

    def listar_relatorios(db: Session, filtros: list) -> ReportResponse:
        pass

    def exportar_relatorios(db:Session, relatorio_data: ReportBase) -> ReportResponse:
        pass

    def filtrar_relatorios(db: Session, relatorio_data: ReportBase) -> ReportResponse:
        pass
