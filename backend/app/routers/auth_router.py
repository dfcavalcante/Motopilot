# Trecho de código (na rota /register)

# 1. Importa a ferramenta
from app.services.security_service import get_password_hash
# from app.database.models import User
# from app.database.connections import get_db

# 2. Rota POST de registro
@router.post("/register")
def register_user(user_data: UserCreateSchema, db: Session = Depends(get_db)):
    
    # --- Ponto CRÍTICO: Geração do Hash na Rota ---
    hashed_password = get_password_hash(user_data.senha) 

    # 3. Cria a instância do Modelo (User) usando o HASH
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password, # Armazenando o HASH, não a senha original
        # ... outros campos
    )
    
    # 4. Salva a instância no DB
    # db.add(new_user)
    # db.commit()
    # return new_user