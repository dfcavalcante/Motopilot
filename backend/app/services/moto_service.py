from sqlalchemy.orm import Session
from sqlalchemy import func, select, update, delete
from app.models.moto_model import Moto
from app.schemas.moto_schema import MotoBase, MotoUpdate, MotoResponse, MotoFilter
from typing import List, Optional

'''
Camada de serviço que será responsável pela lógica de negócios da Moto
Incluindo CRUD e listagem de Motos
'''

class Moto_service:
    @staticmethod
    def criar_moto(self, db:Session, moto_data: MotoBase) -> MotoResponse:
        db_moto = Moto(**moto_data.model_dump()) #converte o Schema em Model
        
        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)

    def listar_motos(self, db:Session, filtro: MotoFilter) ->List[MotoResponse]:
        pass

    def deletar_moto(self, db: Session, id:int) ->MotoResponse:

        db_moto = db.scalars(select(Moto).where(Moto.id == id)).first()

        if not db_moto:
            return None
        
        #resposta do Schema Moto Response antes de invalidar a moto
        response_data = MotoResponse.model_validate(db_moto)

        db.delete(db_moto)
        db.commit()

        return response_data

    def atualizar_moto(self, db:Session, id:int, moto_data: MotoUpdate) -> MotoResponse:
        db_moto = db.scalars(select(Moto).where(Moto.id == id)).first()

        if not db_moto:
            return None
        
        #muda apenas os campos que houve mudança
        update_data = moto_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_moto, key, value) #setattr equivalente db_moto.marca = 'Honda'
        
        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)

        return db_moto

    #aqui a lógica está como cada moto só possui um manual
    def adicionar_manual(self, db:Session, id:int) ->Optional[MotoResponse]:
        db_moto = db.scalars(select(Moto).where(Moto.id == id)).first()

        if not db_moto:
            return None
        
        if db_moto.has_manual: #caso a moto já possua manual, apenas retorna
            return db_moto
        
        db_moto.has_manual=True
        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)

        return db_moto
    
    def arquivar_moto(self, db:Session, id:int) -> Optional[MotoResponse]:
        db_moto = db.scalars(select(Moto).where(Moto.id == id)).first()

        if not db_moto:
            return None
        
        db_moto.is_active=False #"desativa" a moto do banco de dados
        db.add(db_moto)
        db.commit()
        db.refresh(db_moto)

        return db_moto
