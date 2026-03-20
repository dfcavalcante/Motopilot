from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship

#Modelo para armazenar a moto principal
class ModeloMoto(Base):
    __tablename__ = "modelo_motos"

    id = Column(Integer, primary_key=True, index=True)
    #Os dois tem que ser únicos
    marca = Column(String(50), nullable=False, unique=True)
    modelo = Column(String(100), nullable=False, unique=True)


class Moto(Base):
    __tablename__ = "motos"

    id = Column(Integer, primary_key=True, index=True)
    
    # FK para o modelo da moto "pai" - referência a ModeloMoto
    modelo_moto_id = Column(Integer, ForeignKey("modelo_motos.id"), nullable=False)
    
    # Dados específicos dessa instância da moto
    ano = Column(Integer, nullable=False)
    numero_serie = Column(String(100), nullable=True, unique=True) 
    descricao = Column(Text, nullable=True)
    
    manual_pdf_path = Column(String(255), nullable=True)
    imagem_path = Column(String(255), nullable=True)
    estado = Column(String(50), nullable=True)

    # FK para o mecânico responsável (nullable = pode cadastrar sem atribuir)
    mecanico_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relacionamentos
    modelo_moto = relationship("ModeloMoto", backref="motos_instancias")
    chat_logs = relationship("ChatLog", back_populates="moto")
    mecanico = relationship("User", back_populates="motos_atribuidas")
    relatorios = relationship("Report", back_populates="moto")

    @property
    def marca(self):
        return self.modelo_moto.marca if self.modelo_moto else None

    @property
    def modelo(self):
        return self.modelo_moto.modelo if self.modelo_moto else None