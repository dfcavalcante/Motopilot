from fastapi import Depends, HTTPException, status
from app.services.jwt_service import get_current_user
from app.models.user_model import User


def require_gerente(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency que exige que o usuário autenticado tenha função de gerente.
    Útil para rotas administrativas (aprovar relatórios, criar usuários, etc.).
    """
    if current_user.funcao not in ("gerente", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Apenas gerentes podem realizar esta ação.",
        )
    return current_user
