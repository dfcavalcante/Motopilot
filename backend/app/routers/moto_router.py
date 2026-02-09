from fastapi import APIRouter, HTTPException, Depends, Response, Form, File, UploadFile, status, BackgroundTasks
from typing import List
from sqlalchemy.orm import Session
import shutil
import os
import uuid

# --- IMPORT DO VECTOR STORE ---
# Se der erro de import aqui, verifique se o caminho 'app.llm...' está correto
from llm.services.vector_store import vector_store 

# --- AQUI ESTÁ A MUDANÇA: Usamos o processador inteligente ---
from llm.data.pdf_processor import processar_manual_unico

# Imports internos
from app.schemas.moto_schema import (MotoBase, MotoUpdate, MotoResponse)
from app.services.moto_service import Moto_service
from app.database import get_db

router = APIRouter(prefix='/motos', tags=["Motos"])

# Instância única do serviço
moto_service = Moto_service()

UPLOAD_DIR = "manuals"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- FUNÇÃO CORRIGIDA (Substitua a sua antiga por esta) ---
def processar_manual_background(file_path: str, moto_id: int, modelo: str, ano: str):
    """
    Chama o processador INTELIGENTE (Markdown) e salva no ChromaDB.
    """
    try:
        print(f"🔄 [IA] Iniciando processamento inteligente: {modelo}")
        
        # 1. Chama a função que lê tabelas direito (do pdf_processor.py)
        # Ela já devolve os textos e os metadados prontinhos com o moto_id
        chunks, metadatas = processar_manual_unico(file_path, moto_id, modelo, ano)
        
        if not chunks:
            print("⚠️ [IA] Nenhum texto extraído do manual (ou arquivo vazio).")
            return

        # 2. Salva no Vector Store
        print(f"💾 [IA] Salvando {len(chunks)} trechos no ChromaDB...")
        vector_store.adicionar_chunks(textos=chunks, dados=metadatas)
        
        print(f"✅ [IA] Manual do {modelo} (ID: {moto_id}) indexado com sucesso!")
        
    except Exception as e:
        print(f"❌ [IA] Erro na task de background: {e}")

# --- ROTAS (Permanecem iguais) ---

@router.post("/", response_model=MotoResponse, status_code=status.HTTP_201_CREATED)
def criar_moto_endpoint(
    background_tasks: BackgroundTasks, 
    marca: str = Form(...),
    modelo: str = Form(...),
    ano: str = Form(...),
    documento_pdf: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # 1. Salvar Arquivo
    try:
        safe_filename = documento_pdf.filename.replace(" ", "_")
        filename = f"{uuid.uuid4()}_{safe_filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(documento_pdf.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}")
    
    # 2. Criar no Banco SQL
    moto_data = MotoBase(
        marca=marca,
        modelo=modelo,
        ano=str(ano),
        manual_pdf_path=file_path 
    )
    nova_moto = moto_service.criar_moto(db, moto_data)

    # 3. Disparar Ingestão da IA em Segundo Plano
    background_tasks.add_task(
        processar_manual_background, 
        file_path=file_path, 
        moto_id=nova_moto.id, 
        modelo=modelo, 
        ano=str(ano)
    )

    return nova_moto

@router.get('/', response_model=List[MotoResponse])
def listar_motos_endpoint(db: Session = Depends(get_db)):
    return moto_service.listar_motos(db)

@router.patch('/{moto_id}/atualizar', response_model=MotoResponse)
def atualizar_moto_endpoint(moto_id: int, moto_data: MotoUpdate, db: Session = Depends(get_db)):
    moto_atualizada = moto_service.atualizar_moto(db, moto_id, moto_data)
    if not moto_atualizada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_atualizada

@router.patch('/{moto_id}/manual', response_model=MotoResponse)
def adicionar_manual_endpoint(
    moto_id: int, 
    background_tasks: BackgroundTasks,
    documento_pdf: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    moto_existente = moto_service.buscar_moto_por_id(db, moto_id)
    if not moto_existente:
         raise HTTPException(status_code=404, detail="Moto não encontrada")

    try:
        safe_filename = documento_pdf.filename.replace(" ", "_")
        filename = f"{uuid.uuid4()}_{safe_filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(documento_pdf.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao salvar arquivo")

    moto_com_manual = moto_service.adicionar_manual(db, moto_id, file_path)
    
    # Disparar Ingestão da IA (Atualização)
    background_tasks.add_task(
        processar_manual_background, 
        file_path=file_path, 
        moto_id=moto_id, 
        modelo=moto_existente.modelo, 
        ano=moto_existente.ano
    )
        
    return moto_com_manual

@router.patch('/{moto_id}/arquivar', response_model=MotoResponse)
def arquivar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    moto_arquivada = moto_service.arquivar_moto(db, moto_id)
    if not moto_arquivada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_arquivada

@router.delete('/{moto_id}/deletar', status_code=status.HTTP_204_NO_CONTENT)
def deletar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    sucesso = moto_service.deletar_moto(db, moto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)