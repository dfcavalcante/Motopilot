from fastapi import APIRouter, HTTPException, Depends, Response
from typing import List
from app.schemas.moto_schema import (MotoBase, MotoUpdate, MotoResponse, MotoFilter, MotoListResponse)
from app.services.moto_service import Moto_service
from app.database.connections import get_db
from sqlalchemy.orm import Session

#TODO: dps adicionar erros HTTP aqui pra validação

#Prefixo '/motos' será adicionado a todas as rotas, e tags para organizar documentação
router = APIRouter(prefix='/motos', tags=["Motos"])

moto_service = Moto_service()

# Endpoint de adicionar - POST
@router.post("/", response_model=MotoResponse)
def criar_moto_endpoint(moto: MotoBase, db: Session = Depends(get_db)):
    nova_moto = moto_service.criar_moto(db, moto)
    return nova_moto

# Endpoint de listagem - GET
@router.get('/', response_model=MotoListResponse)
def listar_motos_endpoint(filtros: MotoFilter= Depends(),  db: Session = Depends(get_db)):
    pass #ainda falta o services de listar_motos

# Endpoint de atualização - PATCH (modificações parciais)
@router.patch('/{moto_id}', response_model=MotoResponse)
def atualizar_moto_endpoint(moto_id: int, moto_data: MotoUpdate, db: Session = Depends(get_db)):
    moto_atualizada = moto_service.atualizar_moto(db, moto_id, moto_data)
    return moto_atualizada

@router.patch('/{moto_id}', response_model=MotoResponse)
def adicionar_manual_endpoint(moto_id: int, db:Session = Depends(get_db)):
    moto_com_manual = moto_service.adicionar_manual(db, moto_id)
    return moto_com_manual

@router.patch('/{moto_id}', response_model=MotoResponse)
def arquivar_moto_endpoint(moto_id: int, db:Session = Depends(get_db)):
    moto_arquivada = moto_service.arquivar_moto(db, moto_id)
    return moto_arquivada

#Endpoint de deletar - DELETE
@router.delete('/{moto_id}')
def deletar_moto_endpoint(moto_id= int, db: Session = Depends(get_db)):
    moto_deletar = moto_service.deletar_moto(db, moto_id)
    return