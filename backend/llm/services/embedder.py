# Lógica do Sentence-Transformers
from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np

from backend.app.config import Settings
settings = Settings()

class EmbedderService:
    def __init__(self):
        print(f"Carregando o modelo de embedding: {settings.EMBEDDER_MODEL_NAME}...")
        self.model = SentenceTransformer(settings.EMBEDDER_MODEL_NAME)
        print("Modelo carregado com sucesso.")

    def gerar_embedding(self, texto : str) -> List[float]:
        vetor = self.model.encode(texto)
        return vetor.tolist()

    def gerar_embeddings_em_lote(self, lista_textos: List[str]) -> List[List[float]]:
        vetores = self.model.encode(lista_textos, show_progress_bar=True)
        return vetores.tolist()

# Instância global para ser importada e usada   
embedder = EmbedderService()