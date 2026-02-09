from sqlalchemy.orm import Session
from app.models.cargo_model import Cargo # Importe do arquivo correto

def criar_cargos_iniciais(db: Session):
    """Cria os cargos padrão (Apenas os nomes)."""
    # Apenas a lista de nomes (Strings)
    nomes_cargos = ["ADMIN", "GERENTE", "MECANICO"]

    for nome_cargo in nomes_cargos:
        # Verifica se já existe pelo nome
        cargo_existente = db.query(Cargo).filter(Cargo.nome == nome_cargo).first()
        
        if not cargo_existente:
            novo_cargo = Cargo(nome=nome_cargo) # Sem descrição
            db.add(novo_cargo)
            print(f"✅ Cargo criado: {nome_cargo}")
    
    db.commit()