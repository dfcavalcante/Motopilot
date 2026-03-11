from sqlalchemy.orm import Session
from app.models.peca_model import Peca
from app.schemas.peca_schema import PecaCreate


class PecaService:
    def listar_pecas(self, db: Session) -> list[str]:
        """
        Retorna a lista de nomes de peças disponíveis no sistema.
        Se não houver as peças padrão cadastradas, garante a sua inserção.
        """
        pecas = db.query(Peca).all()
        
        pecas_padrao = [
            "Óleo do Motor",
            "Filtro de Óleo",
            "Filtro de Ar",
            "Vela de Ignição",
            "Pastilha de Freio Dianteira",
            "Pastilha de Freio Traseira",
            "Lona de Freio",
            "Pneu Dianteiro",
            "Pneu Traseiro",
            "Câmara de Ar",
            "Bateria",
            "Kit Relação (Coroa, Pinhão e Corrente)",
            "Lâmpada do Farol",
            "Lâmpada da Lanterna Traseira",
            "Lâmpadas dos Piscas",
            "Cabo de Embreagem",
            "Cabo de Acelerador",
            "Cabo de Freio",
            "Fluido de Freio",
            "Líquido de Arrefecimento",
            "Rolamento de Roda",
            "Retentor de Bengala",
            "Óleo de Bengala",
            "Bucha da Balança",
            "Amortecedor Traseiro",
            "Fusíveis",
            "Relé de Partida",
            "Estator",
            "Regulador Retificador",
            "Bomba de Combustível",
            "Filtro de Combustível",
            "Mangueiras de Combustível",
            "Cabo de Velocímetro",
            "Sensor de Velocidade",
            "Manete de Freio",
            "Manete de Embreagem",
            "Pedal de Câmbio",
            "Pedal de Freio",
            "Retrovisores",
            "Capa do Banco"
        ]
        
        # Recupera os nomes atuais para verificação rápida
        nomes_atuais = {p.nome for p in pecas}
        
        novas_pecas = [Peca(nome=nome) for nome in pecas_padrao if nome not in nomes_atuais]
        
        if novas_pecas:
            db.add_all(novas_pecas)
            db.commit()
            pecas = db.query(Peca).all()

        # Retorna apenas a lista de nomes para manter compatibilidade com o frontend
        return [peca.nome for peca in pecas]

    def adicionar_peca(self, db: Session, peca_data: PecaCreate) -> Peca:
        """
        Adiciona uma nova peça ao sistema.
        Ignora caso já exista com esse exato nome para evitar duplicatas, retornando a existente.
        """
        peca_existente = db.query(Peca).filter(Peca.nome == peca_data.nome).first()
        if peca_existente:
            return peca_existente
            
        nova_peca = Peca(nome=peca_data.nome)
        db.add(nova_peca)
        db.commit()
        db.refresh(nova_peca)
        return nova_peca
