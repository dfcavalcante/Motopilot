from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional, Any

# Schema base (campos comuns)
class MotoBase(BaseModel):
    '''
    Schema base com os campos comuns.
    '''
    marca: str
    modelo: str
    ano: int 
    
    numero_serie: str = Field(..., alias="numeroSerie")
    
    manual_pdf_path: str | None = Field(None, alias="manualPdfPath") 
    imagem_path: str | None = Field(None, alias="imagemPath")
    estado: str | None = None 
    descricao: str | None = None

    # Mecânico responsável (nullable — pode cadastrar sem atribuir)
    mecanico_id: Optional[int] = Field(None, alias="mecanicoId")
    
    # ID da moto "pai" (modelo de referência)
    modelo_moto_id: int = Field(..., alias="modeloMotoId")

    # Permite popular tanto por nome (backend) quanto por alias (frontend)
    model_config = ConfigDict(populate_by_name=True)

class ModeloMotoBase(BaseModel):
    '''
    Schema para cadastro de modelos de motos.
    '''
    marca: str
    modelo: str


class ModeloMotoResponse(BaseModel):
    id: int
    marca: str
    modelo: str

    model_config = ConfigDict(from_attributes=True)


class MotoUpdate(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None
    manual_pdf_path: Optional[str] = Field(None, alias="manualPdfPath")
    imagem_path: Optional[str] = Field(None, alias="imagemPath")
    estado: Optional[str] = None
    numero_serie: Optional[str] = Field(None, alias="numeroSerie")
    mecanico_id: Optional[int] = Field(None, alias="mecanicoId")
    modelo_moto_id: Optional[int] = Field(None, alias="modeloMotoId")

    model_config = ConfigDict(populate_by_name=True)

# Schema para devolver (manda pro Frontend)
class MotoResponse(BaseModel):
    id: int
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: int
    numero_serie: Optional[str] = Field(None, alias="numeroSerie")
    manual_pdf_path: Optional[str] = Field(None, alias="manualPdfPath") 
    imagem_path: Optional[str] = Field(None, alias="imagemPath")
    estado: Optional[str] = None 
    descricao: Optional[str] = None
    mecanico_id: Optional[int] = Field(None, alias="mecanicoId")
    modelo_moto_id: Optional[int] = Field(None, alias="modeloMotoId")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    @model_validator(mode='before')
    @classmethod
    def extract_modelo_info(cls, data: Any) -> Any:
        """
        Se o objeto tem um relacionamento 'modelo_moto', extrai marca/modelo de lá.
        Caso contrário, usa os valores diretos.
        """
        if isinstance(data, dict):
            # Se chegou um dict com modelo_moto (ORM serializado)
            if 'modelo_moto' in data and data['modelo_moto']:
                model_obj = data['modelo_moto']
                if isinstance(model_obj, dict):
                    data['marca'] = model_obj.get('marca', data.get('marca'))
                    data['modelo'] = model_obj.get('modelo', data.get('modelo'))
                else:
                    data['marca'] = getattr(model_obj, 'marca', data.get('marca'))
                    data['modelo'] = getattr(model_obj, 'modelo', data.get('modelo'))
            return data

        # Quando vier objeto ORM direto (caso comum no FastAPI com from_attributes=True)
        model_obj = getattr(data, 'modelo_moto', None)
        return {
            'id': getattr(data, 'id', None),
            'marca': getattr(model_obj, 'marca', None),
            'modelo': getattr(model_obj, 'modelo', None),
            'ano': getattr(data, 'ano', None),
            'numero_serie': getattr(data, 'numero_serie', None),
            'manual_pdf_path': getattr(data, 'manual_pdf_path', None),
            'imagem_path': getattr(data, 'imagem_path', None),
            'estado': getattr(data, 'estado', None),
            'descricao': getattr(data, 'descricao', None),
            'mecanico_id': getattr(data, 'mecanico_id', None),
            'modelo_moto_id': getattr(data, 'modelo_moto_id', None),
        }

# Schema para concluir manutenção (recebe dados do relatório)
class AtribuirMecanicoRequest(BaseModel):
    '''
    Dados necessários para atribuir um mecânico à moto.
    '''
    mecanico_id: int = Field(..., alias="mecanicoId")

    model_config = ConfigDict(populate_by_name=True)

class ConcluirManutencaoRequest(BaseModel):
    '''
    Dados necessários para concluir a manutenção e gerar o relatório.
    '''
    cliente_id: int = Field(..., alias="clienteId")
    diagnostico: str
    mecanicos: str
    atividades: str
    pecas: Optional[list[str]] = None
    observacoes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)
    
