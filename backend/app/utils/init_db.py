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


def garantir_coluna_imagem_modelo_motos(db: Session):
    """Garante que a coluna `imagem_moto` exista na tabela `modelo_motos` em bancos já criados."""
    bind = db.get_bind()
    inspector = inspect(bind)

    if "modelo_motos" not in inspector.get_table_names():
        return

    colunas = {coluna["name"] for coluna in inspector.get_columns("modelo_motos")}
    if "imagem_moto" in colunas:
        return

    db.execute(text("ALTER TABLE modelo_motos ADD COLUMN imagem_moto VARCHAR(255)"))
    db.commit()
    print("✅ Migração aplicada: coluna modelo_motos.imagem_moto criada")


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
    print("🔄 Verificando migração de motos para modelo_moto_id...")
    
    try:
        # 1. Garante que a coluna exista (modo compatível para bancos antigos)
        if "modelo_moto_id" not in colunas:
            db.execute(text("ALTER TABLE motos ADD COLUMN modelo_moto_id INTEGER"))
            colunas.add("modelo_moto_id")
            db.commit()
            print("✅ Coluna modelo_moto_id adicionada")

        # 2. Se não há linhas nulas, já está consistente
        null_count = db.execute(
            text("SELECT COUNT(*) FROM motos WHERE modelo_moto_id IS NULL")
        ).scalar_one()
        if null_count == 0:
            print("ℹ️ Migração já realizada: nenhum registro com modelo_moto_id nulo")
            return

        # 3. Só dá para reconstruir o relacionamento automaticamente se marca/modelo existem
        if "marca" not in colunas or "modelo" not in colunas:
            print(
                "⚠️ Existem motos com modelo_moto_id nulo, mas não há colunas marca/modelo para backfill automático"
            )
            return

        # 4. Buscar apenas motos que ainda não têm FK preenchida
        motos_result = db.execute(
            text("SELECT id, marca, modelo, ano FROM motos WHERE modelo_moto_id IS NULL")
        )
        motos = motos_result.fetchall()

        if not motos:
            print("ℹ️ Nenhuma moto pendente para migração")
            return

        for moto_id, marca, modelo, ano in motos:
            # Usar ano 0 como fallback caso seja NULL
            ano_valor = ano if ano is not None else 0

            # Verificar se ModeloMoto já existe
            modelo_moto_existente = db.execute(
                text("SELECT id FROM modelo_motos WHERE marca = :marca AND modelo = :modelo AND ano = :ano"),
                {"marca": marca, "modelo": modelo, "ano": ano_valor}
            ).first()

            if modelo_moto_existente:
                modelo_moto_id = modelo_moto_existente[0]
            else:
                # Criar novo modelo e recuperar o id
                db.execute(
                    text("INSERT INTO modelo_motos (marca, modelo, ano) VALUES (:marca, :modelo, :ano)"),
                    {"marca": marca, "modelo": modelo, "ano": ano_valor}
                )
                resultado = db.execute(
                    text("SELECT id FROM modelo_motos WHERE marca = :marca AND modelo = :modelo AND ano = :ano"),
                    {"marca": marca, "modelo": modelo, "ano": ano_valor}
                ).first()
                modelo_moto_id = resultado[0]

            # Atualizar a moto que estava sem FK
            db.execute(
                text("UPDATE motos SET modelo_moto_id = :modelo_moto_id WHERE id = :moto_id"),
                {"modelo_moto_id": modelo_moto_id, "moto_id": moto_id}
            )

        db.commit()
        print(f"✅ Migração concluída: {len(motos)} motos associadas a ModeloMoto")
            
    except Exception as e:
        db.rollback()
        print(f"❌ Erro durante migração: {str(e)}")
        raise