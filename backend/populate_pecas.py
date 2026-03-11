import sys
import os

# Ensure app is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.peca_model import Peca

db = SessionLocal()

pecas_padrao = [
    "Óleo do Motor",
    "Filtro de Óleo",
    "Filtro de Ar",
    "Vela de Ignição",
    "Pastilha de Freio Dianteira",
    "Pastilha de Freio Traseira",
    "Lona de Freio",
    "Pneu Dianteiro",
    "Pneu Traseiro",
    "Câmara de Ar",
    "Bateria",
    "Kit Relação (Coroa, Pinhão e Corrente)",
    "Lâmpada do Farol",
    "Lâmpada da Lanterna Traseira",
    "Lâmpadas dos Piscas",
    "Cabo de Embreagem",
    "Cabo de Acelerador",
    "Cabo de Freio",
    "Fluido de Freio",
    "Líquido de Arrefecimento",
    "Rolamento de Roda",
    "Retentor de Bengala",
    "Óleo de Bengala",
    "Bucha da Balança",
    "Amortecedor Traseiro",
    "Fusíveis",
    "Relé de Partida",
    "Estator",
    "Regulador Retificador",
    "Bomba de Combustível",
    "Filtro de Combustível",
    "Mangueiras de Combustível",
    "Cabo de Velocímetro",
    "Sensor de Velocidade",
    "Manete de Freio",
    "Manete de Embreagem",
    "Pedal de Câmbio",
    "Pedal de Freio",
    "Retrovisores",
    "Capa do Banco"
]

for nome in pecas_padrao:
    # Inserts only if it doesn't exist
    if not db.query(Peca).filter_by(nome=nome).first():
        db.add(Peca(nome=nome))

db.commit()
print("Peças padrão inseridas com sucesso.")
db.close()
