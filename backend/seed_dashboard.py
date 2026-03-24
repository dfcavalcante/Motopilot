import sys
import os
from datetime import datetime, timedelta
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models.user_model import User
from app.models.cargo_model import Cargo
from app.models.empresa_model import Empresa
from app.models.moto_model import Moto
from app.models.report_model import Report

db = SessionLocal()

def run_seed():
    print("Iniciando seed de dashboard...")
    
    # 1. Garante Empresa base
    empresa = db.query(Empresa).first()
    if not empresa:
        empresa = Empresa(nome_fantasia="Motohouse", cnpj="11222333000199")
        db.add(empresa)
        db.commit()
    
    from app.services.security_service import get_password_hash
    # 2. Cria Admin, Mecânicos e Cliente
    admin = db.query(User).filter(User.email == "email@gmail.com").first()
    if not admin:
        admin = User(
            nome="Admin Motopilot", email="email@gmail.com", senha=get_password_hash("Senha123"), matricula="DEV-000", funcao="GERENTE", empresa_id=empresa.id
        )
        db.add(admin)
        
    mecanico1 = db.query(User).filter(User.email == "mec1@teste.com").first()
    if not mecanico1:
        mecanico1 = User(
            nome="Carlos Mecânico", email="mec1@teste.com", senha="123", matricula="MEC01", funcao="MECANICO", empresa_id=empresa.id
        )
        db.add(mecanico1)
        
    mecanico2 = db.query(User).filter(User.email == "mec2@teste.com").first()
    if not mecanico2:
        mecanico2 = User(
            nome="Ana Mecânica", email="mec2@teste.com", senha="123", matricula="MEC02", funcao="MECANICO", empresa_id=empresa.id
        )
        db.add(mecanico2)
        
    cliente = db.query(User).filter(User.email == "cliente@teste.com").first()
    if not cliente:
        cliente = User(
            nome="João Cliente", email="cliente@teste.com", senha="123", matricula="CLI01", funcao="CLIENTE", empresa_id=empresa.id
        )
        db.add(cliente)
        
    db.commit()

    # 3. Cria Motos
    motos_data = [
        {"marca": "Honda", "modelo": "CG 160", "ano": 2022, "estado": "Manutenção", "mecanico_id": mecanico1.id},
        {"marca": "Yamaha", "modelo": "Fazer 250", "ano": 2021, "estado": "Manutenção", "mecanico_id": mecanico2.id},
        {"marca": "BMW", "modelo": "R1250 GS", "ano": 2023, "estado": "Ativa", "mecanico_id": None},
        {"marca": "Honda", "modelo": "Bros 160", "ano": 2020, "estado": "Aguardando", "mecanico_id": mecanico1.id},
        {"marca": "Kawasaki", "modelo": "Ninja 400", "ano": 2022, "estado": "Concluída", "mecanico_id": mecanico1.id},
        {"marca": "Suzuki", "modelo": "V-Strom 650", "ano": 2019, "estado": "Concluída", "mecanico_id": mecanico2.id},
        {"marca": "Triumph", "modelo": "Tiger 900", "ano": 2023, "estado": "Ativa", "mecanico_id": None},
    ]

    motos_obj = []
    for m in motos_data:
        moto = Moto(
            marca=m["marca"], modelo=m["modelo"], ano=m["ano"], estado=m["estado"], 
            mecanico_id=m["mecanico_id"], numero_serie=f"SN{random.randint(1000,9999)}"
        )
        db.add(moto)
        motos_obj.append(moto)
    
    db.commit()

    # 4. Cria Relatórios (Reports)
    pecas_list = [
        "Kit Relação", "Pastilhas de freio", "Filtros de óleo/ar", 
        "Velas", "Baterias", "Lâmpadas", "Cabos", 
        "Pneus", "Câmara de ar", "Manetes", "Retrovisores", "Óleo lubrificante"
    ]
    status_list = ["Aguardando Revisão", "Aprovado", "Aguardando Revisão", "Aprovado"]
    
    # Limpa relatorios existentes para não misturar os gráficos com peças velhas
    db.query(Report).delete()
    db.commit()
    
    # Gera pesos ordenados para garantir que algumas peças apareçam muito e outras pouco
    pesos = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    
    # Criamos exatamente a quantia certa de relatórios para cada peça para o gráfico ficar perfeito
    for idx, peca in enumerate(pecas_list):
        quantidade = pesos[idx]
        for _ in range(quantidade):
            mecanico = random.choice([mecanico1, mecanico2])
            status = random.choice(status_list)
            moto = random.choice(motos_obj)
            
            rep = Report(
                cliente_id=cliente.id,
                moto_id=moto.id,
                diagnostico="Manutenção de rotina estruturada",
                atividades="Troca da peça",
                observacoes="Peça desgastada.",
                mecanicos=mecanico.nome,
                pecas=peca,
                status=status
            )
            db.add(rep)
        
    db.commit()
    print("Dashboard mock data criado com sucesso!")

if __name__ == "__main__":
    run_seed()
    db.close()
