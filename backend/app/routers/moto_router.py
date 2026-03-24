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

# Imports Motos 
from app.schemas.moto_schema import (MotoBase, MotoUpdate, MotoResponse, ConcluirManutencaoRequest, AtribuirMecanicoRequest)
from app.services.moto_service import Moto_service
from app.database import get_db

# Imports ModeloMoto
from app.schemas.moto_schema import ModeloMotoBase, ModeloMotoResponse
from app.models.moto_model import ModeloMoto
from app.services.moto_pai_service import Moto_pai_service

router = APIRouter(prefix='/motos', tags=["Motos"])

# Instância única do serviço
moto_service = Moto_service()
moto_pai_service = Moto_pai_service()

UPLOAD_DIR = "manuals"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

# --- ROTAS ---
@router.post("/modeloMoto/criar", response_model=ModeloMotoResponse, status_code=status.HTTP_201_CREATED)
def criar_modelo_moto_endpoint(
    marca: str = Form(...),
    modelo: str = Form(...),
    imagem_moto: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    modelo_existente = moto_pai_service.buscar_moto_pai_moto(db, marca, modelo)
    if modelo_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Modelo '{marca} {modelo}' já está registrado no sistema."
        )
    
    caminho_imagem = salvar_arquivo(imagem_moto, sub_pasta="imagens")
    novo_modelo = ModeloMotoBase(marca=marca, modelo=modelo, imagem_moto=caminho_imagem)
    novo_modelo_moto = moto_pai_service.criar_modelo_moto(db, novo_modelo)
    return novo_modelo_moto


@router.get("/modeloMoto/listar", response_model=List[ModeloMotoResponse])
def listar_modelos_moto_endpoint(db: Session = Depends(get_db)):
    return moto_pai_service.listar_motos_pai_motos(db)


@router.post("/", response_model=MotoResponse, status_code=status.HTTP_201_CREATED)
def criar_moto_endpoint(
    background_tasks: BackgroundTasks, 
    marca: str = Form(...),
    modelo: str = Form(...),
    ano: int = Form(...),
    numeroSerie: str = Form(...), # Recebe do Front como numeroSerie
    descricao: str = Form(None),
    documento_pdf: UploadFile = File(...),
    imagem_moto: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # 0. Validar se número de série já existe
    if moto_service.verificar_numero_serie_existente(db, numeroSerie):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Número de série '{numeroSerie}' já está registrado no sistema."
        )

    # 1. Buscar ou criar o ModeloMoto (moto "pai") por marca/modelo
    modelo_moto = moto_pai_service.buscar_moto_pai_moto(db, marca, modelo)
    if not modelo_moto:
        print(f"🔍 Modelo '{marca} {modelo}' não encontrado. Crie o modelo")
    if not modelo_moto:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Modelo '{marca} {modelo}' não encontrado. Cadastre a moto pai primeiro."
        )

    # 2. Salvar arquivos
    caminho_pdf = salvar_arquivo(documento_pdf, sub_pasta="manuais")

    # A moto filha herda exatamente a imagem da moto pai.
    caminho_imagem = modelo_moto.imagem_moto

    # Compatibilidade para modelos antigos sem imagem cadastrada.
    if not caminho_imagem and imagem_moto:
        caminho_imagem = salvar_arquivo(imagem_moto, sub_pasta="imagens")
        modelo_moto.imagem_moto = caminho_imagem
        db.add(modelo_moto)
        db.commit()

    # 3. Criar o Schema de Dados
    # Nota: Agora usamos o modelo_moto_id ao invés de marca/modelo
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

    # 5. Disparar Ingestão da IA
    background_tasks.add_task(
        processar_manual_background, 
        file_path=caminho_pdf,
        moto_id=nova_moto.id, 
        modelo=modelo, 
        ano=str(ano)
    )

    return nova_moto

# --- LISTAR ---
@router.get('/listar', response_model=List[MotoResponse])
def listar_motos_endpoint(db: Session = Depends(get_db)):
    return moto_service.listar_motos(db)

# --- ATUALIZAR ---
@router.patch('/{moto_id}/atualizar', response_model=MotoResponse)
def atualizar_moto_endpoint(moto_id: int, moto_data: MotoUpdate, db: Session = Depends(get_db)):
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
    
    # Disparar Ingestão da IA (Atualização)
    background_tasks.add_task(
        processar_manual_background, 
        file_path=file_path, 
        moto_id=moto_id, 
        modelo=moto_existente.modelo, 
        ano=moto_existente.ano
    )
        
    return moto_com_manual

# --- ARQUIVAR ---
@router.patch('/{moto_id}/arquivar', response_model=MotoResponse)
def arquivar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    moto_arquivada = moto_service.arquivar_moto(db, moto_id)
    if not moto_arquivada:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return moto_arquivada

# --- DELETAR --- 
@router.delete('/{moto_id}/deletar', status_code=status.HTTP_204_NO_CONTENT)
def deletar_moto_endpoint(moto_id: int, db: Session = Depends(get_db)):
    sucesso = moto_service.deletar_moto(db, moto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Moto não encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post('/{moto_id}/concluir', status_code=status.HTTP_200_OK)
def concluir_manutencao_endpoint(
    moto_id: int,
    dados: ConcluirManutencaoRequest,
    db: Session = Depends(get_db)
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
