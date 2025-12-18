class ChatService:
    def gerar_resposta(self, pergunta: str):
        pergunta_lower = pergunta.lower()
        
        # Simulação da Lógica (RAG)
        if "óleo" in pergunta_lower:
            return {
                "resposta": "Para a Honda CG 160, utilize óleo 10W-30. A troca deve ser feita a cada 6.000 km.",
                "fonte": "Manual do Proprietário - Página 38"
            }
        elif "calibragem" in pergunta_lower or "pneu" in pergunta_lower:
            return {
                "resposta": "Pneu dianteiro: 25 PSI (apenas piloto). Pneu traseiro: 29 PSI.",
                "fonte": "Adesivo de Serviço - Balança Traseira"
            }
        
        return {
            "resposta": "Desculpe, não encontrei essa informação nos manuais técnicos cadastrados.",
            "fonte": "Sistema IA"
        }

    def listar_historico(self, usuario_id: int):
        pass

    def salvar_feedback(self, chat_id: int, positivo: bool):
        pass