from pydantic import BaseModel
#Modelo do Usuário 
#(contém todas as informações necessárias para o Gerente conseguir cadastrar os Engenheiros/Técnicos)

class User(BaseModel):
    name: str
    ocupation: str
    
