from fastapi import APIRouter, Depends,  status
from typing import List
from sqlalchemy.orm import Session
from app.services.peca_service import PecaService
from app.schemas.peca_schema import PecaCreate, PecaResponse
from app.database import get_db

router = APIRouter(prefix='/pecas', tags=["Peças"])

peca_service = PecaService()

'''
Achei melhor organizar caso tenha delete ou atualizar peças por algum motivo no futuro
Também para ficar melhor pra colocar as rotas no front
'''

@router.get('/listar', response_model=List[str])
def listar_pecas_disponiveis(db: Session = Depends(get_db)):
    return peca_service.listar_pecas(db)

@router.post('/adicionar', response_model=PecaResponse, status_code=status.HTTP_201_CREATED)
def adicionar_peca_endpoint(peca_data: PecaCreate, db: Session = Depends(get_db)):
    nova_peca = peca_service.adicionar_peca(db, peca_data)
    return nova_peca