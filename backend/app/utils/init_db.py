from sqlalchemy import inspect, text
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


def garantir_coluna_lido_notificacoes(db: Session):
    """Garante que a coluna `lido` exista na tabela `notifications` em bancos já criados."""
    bind = db.get_bind()
    inspector = inspect(bind)

    if "notifications" not in inspector.get_table_names():
        return

    colunas = {coluna["name"] for coluna in inspector.get_columns("notifications")}
    if "lido" in colunas:
        return

    dialect = bind.dialect.name
    if dialect == "postgresql":
        db.execute(text("ALTER TABLE notifications ADD COLUMN lido BOOLEAN NOT NULL DEFAULT FALSE"))
    else:
        db.execute(text("ALTER TABLE notifications ADD COLUMN lido BOOLEAN NOT NULL DEFAULT 0"))

    db.commit()
    print("✅ Migração aplicada: coluna notifications.lido criada")