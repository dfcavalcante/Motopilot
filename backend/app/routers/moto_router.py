from fastapi import APIRouter, HTTPException, Depends, Response, Form, File, UploadFile
from typing import List
from app.schemas.moto_schema import (MotoBase, MotoUpdate, MotoResponse, MotoFilter, MotoListResponse)
from app.services.moto_service import Moto_service
from app.database.connections import get_db
from sqlalchemy.orm import Session
import shutil # Para salvar o arquivo
import os
import uuid

router = APIRouter(prefix='/motos', tags=["Motos"])

moto_service = Moto_service()

#Os manuais vão ser salvos na pasta Manuals
UPLOAD_DIR = "manuals"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=MotoResponse)
def criar_moto_endpoint(
    marca: str = Form(...),
    modelo: str = Form(...),
    ano: int = Form(...),
    documento_pdf: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    
    try:
        filename = f"{uuid.uuid4()}_{documento_pdf.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(documento_pdf.file, buffer)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload do arquivo: {str(e)}")
    
    moto_data = MotoBase(
        marca=marca,
        modelo=modelo,
        ano=ano,
        manual_pdf_path=file_path 
    )

    nova_moto = Moto_service().criar_moto(db, moto_data)
    
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

#A ideia inicial era o criar moto e adicionar manual serem separados mas acabou sendo juntos no criar moto
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