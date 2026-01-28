from select import select
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
        novo_relatorio = Report(**relatorio_data.dict())
        db.add(novo_relatorio)
        db.commit()
        db.refresh(novo_relatorio)
        
        return novo_relatorio
    
    def deletar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportBase:
        db_relatorio = db.scalars(select(Report).where(Report.id == relatorio_data.id)).first()
        if not db_relatorio:
            return None
        db.delete(db_relatorio)
        db.commit()

    #Não tenho ctz se vai dar para ter relatório ativo e inativo(arquivado)
    def arquivar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportBase:
        db_relatorio = db.scalars(select(Report).where(Report.id == relatorio_data.id)).first()
        if not db_relatorio:
            return None

        #No caso não vai funcionar pois não tem esse campo no model, tem que adicionar
        if hasattr(db_relatorio, 'is_active'):
            db_relatorio.is_active = False
            db.add(db_relatorio)
            db.commit()
            db.refresh(db_relatorio)
            return db_relatorio

    def atualizar_relatorio(db: Session, relatorio_data: ReportBase) -> ReportResponse:
        db_relatorio = db.scalars(select(Report).where(Report.id == relatorio_data.id)).first()
        if not db_relatorio:
            return None
        
        relatorio_dict = relatorio_data.model_dump(exclude_unset=True)
        for key, value in relatorio_dict.items():
            setattr(db_relatorio, key, value)

        db.add(db_relatorio)
        db.commit()
        db.refresh(db_relatorio)
        return db_relatorio
    
    def buscar_relatorio_por_id(db:Session, report_id: int):
        db_relatorio = db.scalars(select(Report).where(Report.id == report_id)).first()
        return db_relatorio

    #Listagem simples sem filtro
    def listar_relatorios(db: Session, relatorio_data: ReportBase) -> ReportResponse:
        db_relatorio = db.scalars(select(Report)).all()
        return db_relatorio

    
    def exportar_relatorios(db:Session, relatorio_data: ReportBase) -> ReportResponse:
        db_relatorio = db.scalars(select(Report).where(Report.id == relatorio_data.id)).first()
        

    def filtrar_relatorios(db: Session, filtros: ReportFilter) -> ReportResponse:
        query = select(Report)
        for key, value in filtros.model_dump(exclude_unset=True).items():
            if value is not None:
                query = query.where(getattr(Report, key) == value)
        return db.scalars(query).all()