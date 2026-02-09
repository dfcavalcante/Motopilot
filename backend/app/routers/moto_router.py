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
    numeroSerie: str = Form(...),
    descricao: str = Form(None),
    documento_pdf: UploadFile = File(...),
    imagem_moto: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    #Salvar o caminho do PDF e da imagem usando a função auxiliar
    caminho_pdf = salvar_arquivo(documento_pdf, sub_pasta="manuais")
    caminho_imagem = salvar_arquivo(imagem_moto, sub_pasta="imagens")

    moto_data = MotoBase(
        marca=marca,
        modelo=modelo,
        ano=ano,
        numeroSerie=numeroSerie,
        estado='Ativa',  # Define o estado inicial como "Ativa"
        descricao=descricao,
        manual_pdf_path=caminho_pdf,
        imagem_path=caminho_imagem
    )

    return moto_service.criar_moto(db, moto_data)

@router.get('/listar', response_model=List[MotoResponse])
def listar_motos_endpoint(db: Session = Depends(get_db)):
    # Chama o service sem passar filtros
    return moto_service.listar_motos(db)

# --- UPDATE (PATCH) ---
@router.patch('/{moto_id}/atualizar', response_model=MotoResponse)
def atualizar_moto_endpoint(moto_id: int, moto_data: MotoUpdate, db: Session = Depends(get_db)):
    moto_atualizada = moto_service.atualizar_moto(db, moto_id, moto_data)
    if not moto_atualizada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_atualizada

@router.patch('/{moto_id}/arquivar', response_model=MotoResponse)
def arquivar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    moto_arquivada = moto_service.arquivar_moto(db, moto_id)
    if not moto_arquivada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_arquivada

# --- DELETE ---
@router.delete('/{moto_id}/deletar', status_code=status.HTTP_204_NO_CONTENT)
def deletar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    sucesso = moto_service.deletar_moto(db, moto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

#Função auxiliar para salvar arquivos (PDFs e imagens)
def salvar_arquivo(arquivo: UploadFile, sub_pasta: str = "") -> str | None:
    if not arquivo or not arquivo.filename:
        return None
        
    try:
        filename = f"{uuid.uuid4()}_{arquivo.filename}"
        
        caminho_pasta = os.path.join(UPLOAD_DIR, sub_pasta)
        os.makedirs(caminho_pasta, exist_ok=True)
        
        file_path = os.path.join(caminho_pasta, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(arquivo.file, buffer)
            
        return file_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo {arquivo.filename}: {str(e)}")