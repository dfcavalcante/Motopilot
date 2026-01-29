from fastapi import APIRouter, Depends
from app.services.report_service import ReportService
from app.schemas.report_schema import ReportBase, ReportFilter, ReportResponse, ReportUpdate
from app.database.connections import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/relatorios", tags=['Relatorio'])

report_service = ReportService()

@router.post("/criar", response_model=ReportResponse)
def criar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    novo_relatorio = report_service.criar_relatorio(db, relatorio)
    return novo_relatorio

@router.delete("/{report_id}/deletar", response_model=ReportResponse)
def deletar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    deletar_relatorio = report_service.deletar_relatorio(relatorio, db)
    return deletar_relatorio

@router.get("/listar", response_model=ReportResponse)
def listar_relatorios_endpoint(filtros: ReportFilter = Depends(), db: Session = Depends(get_db)):
    listar_relatorio = report_service.listar_relatorios(filtros, db)
    return listar_relatorio

@router.get("/{report_id}/buscar", response_model=ReportResponse)
def buscar_relatorio_por_id_endpoint(report_id: int, db: Session = Depends(get_db)):
    buscar_relatorio = report_service.buscar_por_id(db, report_id)
    return buscar_relatorio

@router.patch("/{report_id}/arquivar", response_model=ReportResponse)
def arquivar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    arquivar_relatorio = report_service.arquivar_relatorio(relatorio, db)
    return arquivar_relatorio

@router.patch("/{report_id}/atualizar", response_model=ReportResponse)
def atualizar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    atualizar_relatorio = report_service.atualizar_relatorio(relatorio, db)
    return atualizar_relatorio

@router.patch("/{report_id}/exportar", response_model=ReportResponse)
def exportar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    exportar_relatorio = report_service.exportar_relatorios(relatorio, db)
    return exportar_relatorio

