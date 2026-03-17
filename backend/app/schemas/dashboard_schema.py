from pydantic import BaseModel, ConfigDict

class DashboardGerenteResponse(BaseModel):
    '''Métricas globais da oficina para o Gerente.'''
    total_usuarios: int
    total_motos: int
    motos_em_manutencao: int
    motos_disponiveis: int
    motos_concluidas: int
    relatorios_pendentes: int # Aguardando Revisão
    relatorios_concluidos: int # Aprovado
    total_manutencoes_realizadas: int # Soma de todos os relatórios
    motos_aguardando_manutencao: int # Sem relatório gerado ainda
    pecas: list[dict]

    model_config = ConfigDict(populate_by_name=True)

class DashboardMecanicoResponse(BaseModel):
    '''Métricas individuais para o Mecânico logado.'''
    motos_atribuidas: int
    motos_manutencao_feita: int
    relatorios_feitos: int

    model_config = ConfigDict(populate_by_name=True)
