from sqlalchemy import Float, Integer, Column, Boolean, String
from app.schemas.report_schema import ReportBase
from app.database.connections import Base

class Report(Base):
    __tablename__ = "relatorio"

    id= Column(Integer, primary_key=True, index=True, autoincrement=True)
    moto_id = Column(Integer, nullable=False, index=True)
    cliente = Column(String, nullable=False)
    diagnostico = Column(String, nullable=False)
    mecanicos = Column(String, nullable=False)
    servicos = Column(String, nullable=False)
    pecas_trocadas = Column(String, nullable=False)
    observacoes = Column(String, nullable=True)
    #TODO: fotos e campo de assinatura digital