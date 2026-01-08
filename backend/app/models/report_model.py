from sqlalchemy import Float, Integer, Column, Boolean, String
from app.schemas.report_schema import ReportBase
from app.database.connections import Base

class Report(Base):
    __tablename__ = "relatorio"

    id= Column(Integer, primary_key=True, index=True, autoincrement=True)

    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False)
    moto_id = Column(Integer, ForeignKey("motos.id"), nullable=False)

    diagnostico = Column(String, nullable=False)
    atividades = Column(String, nullable=False)
    observacoes = Column(String, nullable=False)



        # Relacionamentos
    cliente = relationship("Cliente", back_populates="relatorios")
    moto = relationship("Moto", back_populates="relatorios")
     
     #TODO: fotos e campo de assinatura digital