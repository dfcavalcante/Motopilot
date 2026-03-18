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


def garantir_coluna_mecanico_id_motos(db: Session):
    """Garante que a coluna `mecanico_id` exista na tabela `motos` em bancos já criados."""
    bind = db.get_bind()
    inspector = inspect(bind)

    if "motos" not in inspector.get_table_names():
        return

    colunas = {coluna["name"] for coluna in inspector.get_columns("motos")}
    if "mecanico_id" in colunas:
        return

    dialect = bind.dialect.name
    if dialect == "postgresql":
        db.execute(text("ALTER TABLE motos ADD COLUMN mecanico_id INTEGER REFERENCES users(id)"))
    else:
        db.execute(text("ALTER TABLE motos ADD COLUMN mecanico_id INTEGER"))

    db.commit()
    print("✅ Migração aplicada: coluna motos.mecanico_id criada")

def garantir_coluna_status_relatorio(db: Session):
    """Garante que a coluna `status` exista na tabela `relatorios` em bancos já criados."""
    bind = db.get_bind()
    inspector = inspect(bind)

    if "relatorios" not in inspector.get_table_names():
        return

    colunas = {coluna["name"] for coluna in inspector.get_columns("relatorios")}
    if "status" in colunas:
        return

    dialect = bind.dialect.name
    if dialect == "postgresql":
        db.execute(text("ALTER TABLE relatorios ADD COLUMN status TEXT NOT NULL DEFAULT 'Aguardando Revisão'"))
    else:
        db.execute(text("ALTER TABLE relatorios ADD COLUMN status TEXT NOT NULL DEFAULT 'Aguardando Revisão'"))

    db.commit()
    print("✅ Migração aplicada: coluna relatorios.status criada")


def migrar_motos_para_modelo_moto_id(db: Session):
    """
    Migra o relacionamento de Moto de usar marca/modelo diretos para usar modelo_moto_id.
    Isso é necessário para suportar motos "pai" (templates).
    """
    bind = db.get_bind()
    inspector = inspect(bind)
    
    # Verificar se a tabela motos existe
    if "motos" not in inspector.get_table_names():
        print("ℹ️ Tabela motos ainda não existe, nada a migrar")
        return
    
    colunas = {coluna["name"] for coluna in inspector.get_columns("motos")}
    
    # Se já tem modelo_moto_id, migração já foi feita
    if "modelo_moto_id" in colunas:
        print("ℹ️ Coluna modelo_moto_id já existe, migração já realizada")
        return
    
    print("🔄 Iniciando migração de motos para modelo_moto_id...")
    
    try:
        dialect = bind.dialect.name
        
        # 1. Se temos as colunas marca/modelo, popular modelo_moto_id
        if "marca" in colunas and "modelo" in colunas:
            # Buscar todas as motos existentes
            motos_result = db.execute(text("SELECT id, marca, modelo FROM motos"))
            motos = motos_result.fetchall()
            
            if motos:
                # Para cada moto, criar um ModeloMoto correspondente
                from app.models.moto_model import ModeloMoto
                
                for moto_id, marca, modelo in motos:
                    # Verificar se ModeloMoto já existe
                    modelo_moto_existente = db.execute(
                        text("SELECT id FROM modelo_motos WHERE marca = :marca AND modelo = :modelo"),
                        {"marca": marca, "modelo": modelo}
                    ).first()
                    
                    if modelo_moto_existente:
                        modelo_moto_id = modelo_moto_existente[0]
                    else:
                        # Criar novo
                        db.execute(
                            text("INSERT INTO modelo_motos (marca, modelo) VALUES (:marca, :modelo)"),
                            {"marca": marca, "modelo": modelo}
                        )
                        resultado = db.execute(
                            text("SELECT id FROM modelo_motos WHERE marca = :marca AND modelo = :modelo"),
                            {"marca": marca, "modelo": modelo}
                        ).first()
                        modelo_moto_id = resultado[0]
                    
                    # Adicionar coluna modelo_moto_id se não existir
                    if "modelo_moto_id" not in colunas:
                        if dialect == "postgresql":
                            db.execute(text("ALTER TABLE motos ADD COLUMN modelo_moto_id INTEGER"))
                        else:
                            db.execute(text("ALTER TABLE motos ADD COLUMN modelo_moto_id INTEGER"))
                        colunas.add("modelo_moto_id")
                    
                    # Atualizar a moto
                    db.execute(
                        text("UPDATE motos SET modelo_moto_id = :modelo_moto_id WHERE id = :moto_id"),
                        {"modelo_moto_id": modelo_moto_id, "moto_id": moto_id}
                    )
                
                db.commit()
                print(f"✅ Migração: {len(motos)} motos associadas a ModeloMoto")
        else:
            # Se não têm marca/modelo, é um banco novo, só adiciona a coluna
            if dialect == "postgresql":
                db.execute(text("ALTER TABLE motos ADD COLUMN modelo_moto_id INTEGER NOT NULL"))
            else:
                db.execute(text("ALTER TABLE motos ADD COLUMN modelo_moto_id INTEGER NOT NULL"))
            db.commit()
            print("✅ Coluna modelo_moto_id adicionada")
            
    except Exception as e:
        db.rollback()
        print(f"❌ Erro durante migração: {str(e)}")
        raise