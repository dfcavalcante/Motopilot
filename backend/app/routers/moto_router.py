from fastapi import APIRouter, HTTPException, Depends, Response
from typing import List
from schemas.moto_schema import (MotoBase, MotoUpdate, MotoResponse, MotoFilter, MotoListResponse)
from services.moto_service import Moto_service

#Prefixo '/motos' será adicionado a todas as rotas, e tags para organizar documentação
router = APIRouter(prefix='/motos', tags=["Motos"])

# Endpoint de adicionar - POST
@router.post("/", respons_model=MotoResponse)
def criar_moto_endpoint(moto: MotoBase):
    pass

# Endpoint de listagem - GET
@router.get('/', response_model=MotoListResponse)
def listar_motos_endpoint(filtros: MotoFilter= Depends()):
    pass

@router.get('{moto_id}', response_model=MotoResponse)
def buscar_moto_endpoint(moto_id: int):
    pass

# Endpoint de atualização - PUT
@router.put('/{moto_id}', response_model=MotoResponse)
def atualizar_moto_endpoint(moto_id: int, moto_data: MotoUpdate):
    pass

#Endpoint de deletar - DELETE
@router.delete('/{moto_id}')
def deletar_moto_endpoint(moto_id=int):
    pass


