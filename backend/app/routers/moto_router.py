from fastapi import APIRouter, HTTPException, Depends, Response, Form, File, UploadFile, status, BackgroundTasks
from typing import List, Optional
from sqlalchemy.orm import Session
import shutil
import os
import uuid

# --- IMPORT DO VECTOR STORE ---
from llm.services.vector_store import vector_store 

from llm.data.pdf_processor import processar_manual_unico

# Imports Motos 
from app.schemas.moto_schema import (MotoBase, MotoUpdate, MotoResponse, ConcluirManutencaoRequest, AtribuirMecanicoRequest)
from app.services.moto_service import Moto_service
from app.database import get_db
from app.services.jwt_service import get_current_user
from app.models.user_model import User

# Imports ModeloMoto
from app.schemas.moto_schema import ModeloMotoBase, ModeloMotoResponse
from app.models.moto_model import ModeloMoto
from app.services.moto_pai_service import Moto_pai_service
from app.services.notification_service import NotificationService

router = APIRouter(prefix='/motos', tags=["Motos"])

# Instância única do serviço
moto_service = Moto_service()
moto_pai_service = Moto_pai_service()

UPLOAD_DIR = "manuals"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def processar_manual_background(file_path: str, modelo_id: int, modelo: str, ano: str):
    """
    Chama o processador INTELIGENTE (Markdown) e salva no ChromaDB.
    """
    try:
        print(f"🔄 [IA] Iniciando processamento inteligente: {modelo}")
        
        # 1. Chama a função que lê tabelas direito (do pdf_processor.py)
        # Ela já devolve os textos e os metadados prontinhos com o modelo_id
        chunks, metadatas = processar_manual_unico(file_path, modelo_id, modelo, ano)
        
        if not chunks:
            print("⚠️ [IA] Nenhum texto extraído do manual (ou arquivo vazio).")
            return

        # 2. Salva no Vector Store
        print(f"💾 [IA] Salvando {len(chunks)} trechos no ChromaDB...")
        vector_store.adicionar_chunks(textos=chunks, dados=metadatas)
        
        print(f"✅ [IA] Manual do {modelo} (Modelo ID: {modelo_id}) indexado com sucesso!")
        
    except Exception as e:
        print(f"❌ [IA] Erro na task de background: {e}")

# --- ROTAS ---
@router.post("/modeloMoto/criar", response_model=ModeloMotoResponse, status_code=status.HTTP_201_CREATED)
def criar_modelo_moto_endpoint(
    background_tasks: BackgroundTasks,
    marca: str = Form(...),
    modelo: str = Form(...),
    ano: int = Form(...),
    imagem_moto: UploadFile = File(...),
    documento_pdf: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    modelo_existente = moto_pai_service.buscar_moto_pai_moto(db, marca, modelo, ano)
    if modelo_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Modelo '{marca} {modelo} {ano}' já está registrado no sistema."
        )
    
    caminho_imagem = salvar_arquivo(imagem_moto, sub_pasta="imagens")
    caminho_pdf = salvar_arquivo(documento_pdf, sub_pasta="manuais")
    
    novo_modelo = ModeloMotoBase(
        marca=marca, 
        modelo=modelo, 
        ano=ano, 
        imagem_moto=caminho_imagem,
        manual_pdf_path=caminho_pdf
    )
    novo_modelo_moto = moto_pai_service.criar_modelo_moto(db, novo_modelo)

    # Disparar Ingestão da IA atrelada ao Modelo
    background_tasks.add_task(
        processar_manual_background, 
        file_path=caminho_pdf,
        modelo_id=novo_modelo_moto.id, 
        modelo=modelo, 
        ano=str(ano)
    )

    # Notificar gerente sobre novo modelo criado
    notification_service = NotificationService(db)
    notification_service.notificar_moto(
        action="criada",
        moto_id=novo_modelo_moto.id,
        moto_marca=marca,
        moto_modelo=modelo,
    )

    return novo_modelo_moto


@router.get("/modeloMoto/listar", response_model=List[ModeloMotoResponse])
def listar_modelos_moto_endpoint(db: Session = Depends(get_db)):
    return moto_pai_service.listar_motos_pai_motos(db)


@router.post("/", response_model=MotoResponse, status_code=status.HTTP_201_CREATED)
def criar_moto_endpoint(
    marca: str = Form(...),
    modelo: str = Form(...),
    ano: int = Form(...),
    numeroSerie: str = Form(...), # Recebe do Front como numeroSerie
    descricao: str = Form(None),
    imagem_moto: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 0. Validar se número de série já existe
    if moto_service.verificar_numero_serie_existente(db, numeroSerie):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Número de série '{numeroSerie}' já está registrado no sistema."
        )

    # 1. Buscar ou criar o ModeloMoto (moto "pai") por marca/modelo/ano
    modelo_moto = moto_pai_service.buscar_moto_pai_moto(db, marca, modelo, ano)
    if not modelo_moto:
        print(f"🔍 Modelo '{marca} {modelo} {ano}' não encontrado. Crie o modelo")
    if not modelo_moto:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Modelo '{marca} {modelo} {ano}' não encontrado. Cadastre a moto pai primeiro."
        )

    # 2. Herdando arquivos do Modelo Pai
    caminho_pdf = modelo_moto.manual_pdf_path

    # A moto filha herda a imagem da moto pai, ou usa uma própria se enviada
    if imagem_moto:
        caminho_imagem = salvar_arquivo(imagem_moto, sub_pasta="imagens")
    else:
        caminho_imagem = modelo_moto.imagem_moto

    # 3. Criar o Schema de Dados
    moto_data = MotoBase(
        marca=marca,
        modelo=modelo,
        ano=ano,
        numero_serie=numeroSerie,
        estado='Ativa',
        descricao=descricao,
        manual_pdf_path=caminho_pdf,
        imagem_path=caminho_imagem,
        modelo_moto_id=modelo_moto.id  # <--- FK para a moto "pai"
    )
    
    # 4. Criar no Banco
    try:
        nova_moto = moto_service.criar_moto(db, moto_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # Notificar gerente sobre nova moto cadastrada
    notification_service = NotificationService(db)
    notification_service.notificar_moto(
        action="criada",
        moto_id=nova_moto.id,
        moto_marca=marca,
        moto_modelo=modelo,
    )

    return nova_moto

# --- LISTAR ---
@router.get('/listar', response_model=List[MotoResponse])
def listar_motos_endpoint(db: Session = Depends(get_db)):
    return moto_service.listar_motos(db)

# --- ATUALIZAR ---
@router.patch('/{moto_id}/atualizar', response_model=MotoResponse)
def atualizar_moto_endpoint(moto_id: int, moto_data: MotoUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    moto_atualizada = moto_service.atualizar_moto(db, moto_id, moto_data)
    if not moto_atualizada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_atualizada

@router.patch('/{moto_id}/atribuir', response_model=MotoResponse)
def atribuir_mecanico_endpoint(moto_id: int, dados: AtribuirMecanicoRequest, db: Session = Depends(get_db)):
    """Atribui a moto a um mecânico específico e altera o status para 'Em Manutenção'"""
    try:
        moto_atualizada = moto_pai_service.atribuir_mecanico(db, moto_id, dados.mecanico_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

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
    
    # Se o manual for adicionado na moto individual, a compatibilidade do modelo seria ideal, mas mantemos o fallback:
    background_tasks.add_task(
        processar_manual_background, 
        file_path=file_path, 
        modelo_id=moto_existente.modelo_moto_id, 
        modelo=moto_existente.modelo, 
        ano=moto_existente.ano
    )
        
    return moto_com_manual

# --- ARQUIVAR ---
@router.patch('/{moto_id}/arquivar', response_model=MotoResponse)
def arquivar_moto_endpoint(moto_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    moto_arquivada = moto_service.arquivar_moto(db, moto_id)
    if not moto_arquivada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_arquivada

# --- DELETAR --- 
@router.delete('/{moto_id}/deletar', status_code=status.HTTP_204_NO_CONTENT)
def deletar_moto_endpoint(moto_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sucesso = moto_service.deletar_moto(db, moto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post('/{moto_id}/concluir', status_code=status.HTTP_200_OK)
def concluir_manutencao_endpoint(
    moto_id: int,
    dados: ConcluirManutencaoRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Conclui a manutenção de uma moto e gera o relatório automaticamente.
    A moto tem seu estado alterado para 'Concluída' e um Report é criado
    na mesma transação (atômico).
    """
    try:
        resultado = moto_service.concluir_manutencao(db, moto_id, dados)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not resultado:
        raise HTTPException(status_code=404, detail="Moto não encontrada")

    return {
        "message": "Manutenção concluída com sucesso!",
        "moto_id": resultado["moto"].id,
        "moto_estado": resultado["moto"].estado,
        "relatorio_id": resultado["relatorio"].id
    }

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
    

# --- VERIFICAÇÕES ---
@router.get('/check/{numero_serie}')
def verificar_numero_serie_endpoint(numero_serie: str, db: Session = Depends(get_db)):
    """Retorna `{{"exists": true}}` se o número de série já estiver no banco."""
    exists = moto_service.verificar_numero_serie_existente(db, numero_serie)
    return {"exists": exists}

# --- GRÁFICOS ---
@router.get("/graficos/motos")
def graficos_motos_endpoint(db: Session = Depends(get_db)):
    graficos_motos = moto_service.graficos_motos(db)
    return graficos_motos
