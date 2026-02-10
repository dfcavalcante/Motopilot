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

        # --- ADICIONE ISTO AQUI ---
        print("\n" + "="*50)
        print("🕵️ DEBUG: O QUE ESTÁ SENDO ENVIADO PARA O OLLAMA:")
        print(full_prompt)
        print("="*50 + "\n")
        # --------------------------

        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,
                "num_ctx": 4096 
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

            def generate_stream(self, system_prompt: str, user_prompt: str):
                """
                Envia o prompt para o Ollama com streaming habilitado.
                Retorna um generator que produz tokens um a um.
                """
                url = f"{self.base_url}/api/generate"
        
                full_prompt = f"{system_prompt}\n\nPERGUNTA DO USUÁRIO: {user_prompt}"

                payload = {
                    "model": self.model,
                    "prompt": full_prompt,
                    "stream": True,
                    "options": {
                        "temperature": 0.1,
                        "num_ctx": 4096 
                    }
                }

                try:
                    print(f"📡 Iniciando streaming Ollama ({self.model})...")
                    response = requests.post(url, json=payload, stream=True)
            
                    if response.status_code == 200:
                        for line in response.iter_lines():
                            if line:
                                try:
                                    data = json.loads(line)
                                    token = data.get("response", "")
                                    if token:
                                        yield token
                                except json.JSONDecodeError:
                                    continue
                    else:
                        yield f"Erro na API Ollama: {response.status_code}"
            
                except requests.exceptions.ConnectionError:
                    yield "Erro Crítico: Não foi possível conectar ao Ollama."
                except Exception as e:
                    yield f"Erro no streaming: {str(e)}"

        # Instância pronta para ser importada pelo orquestrador
        llm_client = LLMClient()