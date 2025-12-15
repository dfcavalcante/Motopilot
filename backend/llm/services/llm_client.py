import requests
import json
from config import settings

class LLMClient:
    def __init__(self):
        # Monta a URL da API do Ollama
        self.api_url = f"{settings.OLLAMA_BASE_URL}/api/generate"
        self.model = settings.LLM_MODEL_NAME

    def gerar_resposta(self, prompt: str, stream: bool = False) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": stream, # False = espera a resposta inteira ficar pronta
            "options": {
                "temperature": 0.3, 
                "num_ctx": 4096     # Tamanho da janela de contexto 
            }
        }

        try:
            # Faz a requisição POST para o seu Ollama local
            response = requests.post(self.api_url, json=payload, timeout=60)
            
            # Verifica se deu erro
            response.raise_for_status()
            
            # O Ollama retorna um JSON com a chave 'response'
            dados = response.json()
            return dados.get("response", "")

        except requests.exceptions.ConnectionError:
            return "Erro: Não foi possível conectar ao Ollama. Verifique se ele está rodando (ollama serve)."
        except Exception as e:
            return f"Erro ao gerar resposta: {str(e)}"

# Instância global para ser usada no Orchestrator
llm_client = LLMClient()

# --- Bloco de Teste Rápido (Só roda se executar o arquivo direto) ---
if __name__ == "__main__":
    print("Testando conexão com Ollama...")
    teste = llm_client.gerar_resposta("Responda apenas 'OK' se você estiver ouvindo.")
    print(f"Resposta do LLM: {teste}")