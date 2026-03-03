from pydantic import BaseModel, ConfigDict

class DashboardGerenteResponse(BaseModel):
    '''Métricas globais da oficina para o Gerente.'''
    total_usuarios: int
    total_motos: int
    total_manutencoes_realizadas: int
    motos_aguardando_manutencao: int

    model_config = ConfigDict(populate_by_name=True)

class DashboardMecanicoResponse(BaseModel):
    '''Métricas individuais para o Mecânico logado.'''
    motos_atribuidas: int
    manutencoes_realizadas: int

    model_config = ConfigDict(populate_by_name=True)
