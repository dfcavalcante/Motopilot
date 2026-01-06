import requests
import json
from app.config import settings

class LLMClient:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model = settings.LLM_MODEL_NAME

    def generate(self, system_prompt: str, user_prompt: str) -> str:
        """
        Envia o prompt para o Ollama e retorna a resposta em texto.
        """
        url = f"{self.base_url}/api/generate"
        
        # Monta o prompt combinando a instrução do sistema (System) + a pergunta (User)
        full_prompt = f"{system_prompt}\n\nPERGUNTA DO USUÁRIO: {user_prompt}"

        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "stream": False, # False para receber a resposta inteira de uma vez
            "options": {
                "temperature": 0.1, # Temperatura baixa = Mais fiel ao manual
                "num_ctx": 4096     # Contexto maior para caber os trechos do PDF
            }
        }

        try:
            print(f"📡 Enviando requisição para Ollama ({self.model})...")
            response = requests.post(url, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "Erro: O modelo retornou vazio.")
            else:
                return f"Erro na API Ollama: {response.status_code} - {response.text}"
            
        except requests.exceptions.ConnectionError:
            return "Erro Crítico: Não foi possível conectar ao Ollama. Verifique se ele está rodando no terminal (ollama serve)."
        except Exception as e:
            return f"Erro desconhecido na IA: {str(e)}"

# Instância pronta para ser importada pelo orquestrador
llm_client = LLMClient()