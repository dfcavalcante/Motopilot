from fastapi import APIRouter, Depends
from services.report_service import ReportService
from schemas.report_schema import ReportBase, ReportFilter, ReportResponse, ReportUpdate
from database.connections import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/report", tags=['report'])

report_service = ReportService()

@router.post("/", response_model=ReportResponse)
def criar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    novo_relatorio = report_service.criar_relatorio(relatorio, db)
    return novo_relatorio

@router.delete("/", response_model=ReportResponse)
def deletar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    deletar_relatorio = report_service.deletar_relatorio(relatorio, db)
    return deletar_relatorio

@router.patch("/", response_model=ReportResponse)
def arquivar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    arquivar_relatorio = report_service.arquivar_relatorio(relatorio, db)
    return arquivar_relatorio

@router.patch("/", response_model=ReportResponse)
def atualizar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    atualizar_relatorio = report_service.atualizar_relatorio(relatorio, db)
    return atualizar_relatorio

@router.patch("/", response_model=ReportResponse)
def listar_relatorio_endpoint(relatorio: ReportBase, db:Session = Depends(get_db)):
    listar_relatorio = report_service.listar_relatorios(relatorio, db)
    return listar_relatorio

@router.patch("/", response_model=ReportResponse)
def exportar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    exportar_relatorio = report_service.exportar_relatorios(relatorio, db)
    return exportar_relatorio

