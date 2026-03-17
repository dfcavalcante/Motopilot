from fastapi import APIRouter, Depends, HTTPException
from app.services.report_service import ReportService
from app.schemas.report_schema import ReportBase, ReportFilter, ReportResponse, ReportUpdate
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/relatorio", tags=['Relatório'])

report_service = ReportService()

@router.post("/", response_model=ReportResponse)
def criar_relatorio_endpoint(relatorio: ReportBase, db: Session = Depends(get_db)):
    novo_relatorio = report_service.criar_relatorio(db, relatorio)
    return novo_relatorio

@router.delete("/{report_id}", response_model=ReportResponse)
def deletar_relatorio_endpoint(report_id: int, db: Session = Depends(get_db)):
    deletar_relatorio = report_service.deletar_relatorio(db, report_id)
    if not deletar_relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return deletar_relatorio

@router.get("/", response_model=list[ReportResponse])
def listar_relatorios_endpoint(filtros: ReportFilter = Depends(), db: Session = Depends(get_db)):
    listar_relatorio = report_service.listar_relatorios(db, filtros)
    return listar_relatorio

@router.patch("/{report_id}/concluir", response_model=ReportResponse)
def concluir_relatorio_endpoint(report_id: int, db:Session = Depends(get_db)):
    concluir_relatorio = report_service.concluir_relatorio(db, report_id)
    if not concluir_relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return concluir_relatorio

@router.get("/{report_id}", response_model=ReportResponse)
def buscar_relatorio_por_id_endpoint(report_id: int, db: Session = Depends(get_db)):
    buscar_relatorio = report_service.buscar_relatorio_por_id(db, report_id)
    if not buscar_relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return buscar_relatorio

@router.patch("/{report_id}/arquivar", response_model=ReportResponse)
def arquivar_relatorio_endpoint(report_id: int, db: Session = Depends(get_db)):
    arquivar_relatorio = report_service.arquivar_relatorio(db, report_id)
    if not arquivar_relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return arquivar_relatorio

@router.patch("/{report_id}/aprovar", response_model=ReportResponse)
def aprovar_relatorio_endpoint(report_id: int, db: Session = Depends(get_db)):
    aprovar_relatorio = report_service.aprovar_relatorio(db, report_id)
    if not aprovar_relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return aprovar_relatorio

@router.patch("/{report_id}/atualizar", response_model=ReportResponse)
def atualizar_relatorio_endpoint(report_id: int, relatorio: ReportUpdate, db: Session = Depends(get_db)):
    atualizar_relatorio = report_service.atualizar_relatorio(db, report_id, relatorio)
    if not atualizar_relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return atualizar_relatorio

@router.post("/{report_id}/exportar", response_model=ReportResponse)
def exportar_relatorio_endpoint(report_id: int, db: Session = Depends(get_db)):
    exportar_relatorio = report_service.exportar_relatorios(db, report_id)
    if not exportar_relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return exportar_relatorio

# --- Gráfico para status dos relatórios ---
@router.get("/graficos/relatorios")
def graficos_relatorio_endpoint(db: Session = Depends(get_db)):
    return report_service.graficos_relatorio(db)

# --- Gráfico para peças que mais quebraram ---
@router.get("/graficos/pecas")
def graficos_pecas_endpoint(db: Session = Depends(get_db)):
    return report_service.graficos_pecas(db)
