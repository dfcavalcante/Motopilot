from schemas.moto_schema import MotoBase, MotoUpdate, MotoResponse
from typing import List, Optional

'''
Camada de serviço que será responsável pela lógica de negócios da Moto
Incluindo CRUD e listagem de Motos
'''

class Moto_service:
    @staticmethod
    def criar_moto(self, moto_data: MotoBase) -> MotoResponse:
        pass

    def listar_motos(self) ->List[MotoResponse]:
        pass

    def deletar_moto(self) ->MotoResponse:
        pass

    def atualizar_moto(self, moto_data: MotoUpdate) -> MotoResponse:
        pass

    def adicionar_manual(self):
        pass

    def arquivar_moto(self) -> MotoResponse:
        pass

