from passlib.context import CryptContext
from passlib.exc import UnknownHashError

# Configurações de hash de senha (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Função para gerar o hash da senha
def get_password_hash(password: str) -> str:
    """Gera o hash Bcrypt para a senha fornecida."""
    # O 'pwd_context.hash' usa o algoritmo bcrypt para criar o hash
    return pwd_context.hash(password)

# Função para verificar se a senha fornecida corresponde ao hash armazenado
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto puro corresponde ao hash armazenado."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except UnknownHashError:
        # O hash armazenado não é um hash bcrypt válido (ex: senha em texto plano
        # inserida diretamente no banco). Nega o acesso ao invés de crashar.
        return False