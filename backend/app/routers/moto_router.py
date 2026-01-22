from fastapi import APIRouter, HTTPException, Depends, Response, Form, File, UploadFile, status
from typing import List
from sqlalchemy.orm import Session
import shutil
import os
import uuid

# Imports internos
from app.schemas.moto_schema import (MotoBase, MotoUpdate, MotoResponse)
from app.services.moto_service import Moto_service
from app.database.connections import get_db

router = APIRouter(prefix='/motos', tags=["Motos"])

# Instância única do serviço
moto_service = Moto_service()

UPLOAD_DIR = "manuals"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=MotoResponse, status_code=status.HTTP_201_CREATED)
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
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}")
    
    moto_data = MotoBase(
        marca=marca,
        modelo=modelo,
        ano=ano,
        manual_pdf_path=file_path 
    )

    return moto_service.criar_moto(db, moto_data)

@router.get('/', response_model=List[MotoResponse])
def listar_motos_endpoint(db: Session = Depends(get_db)):
    # Chama o service sem passar filtros
    return moto_service.listar_motos(db)

# --- UPDATE (PATCH) ---
@router.patch('/{moto_id}', response_model=MotoResponse)
def atualizar_moto_endpoint(moto_id: int, moto_data: MotoUpdate, db: Session = Depends(get_db)):
    moto_atualizada = moto_service.atualizar_moto(db, moto_id, moto_data)
    if not moto_atualizada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_atualizada

@router.patch('/{moto_id}/manual', response_model=MotoResponse)
def adicionar_manual_endpoint(
    moto_id: int, 
    documento_pdf: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    try:
        filename = f"{uuid.uuid4()}_{documento_pdf.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(documento_pdf.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao salvar arquivo")

    moto_com_manual = moto_service.adicionar_manual(db, moto_id, file_path)
    
    if not moto_com_manual:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
        
    return moto_com_manual

@router.patch('/{moto_id}/arquivar', response_model=MotoResponse)
def arquivar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    moto_arquivada = moto_service.arquivar_moto(db, moto_id)
    if not moto_arquivada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_arquivada

# --- DELETE ---
@router.delete('/{moto_id}', status_code=status.HTTP_204_NO_CONTENT)
def deletar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    sucesso = moto_service.deletar_moto(db, moto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)