import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.services.report_service import ReportService
from app.models.report_model import Report
from sqlalchemy import select

db = SessionLocal()

print("All reports in DB:")
all_r = db.scalars(select(Report)).all()
for r in all_r:
    print(r.id, r.status)

print("-" * 20)
print("graficos_relatorio output:")
res = ReportService.graficos_relatorio(db)
print(res)

db.close()
