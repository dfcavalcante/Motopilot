import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
});

export const sendChatMessage = async (userMessage, userId, motoId) => {
  
  if (!motoId) {
    console.error("Erro: Nenhuma moto selecionada!");
    return;
  }

  const payload = {
    pergunta: userMessage,
    usuario_id: parseInt(userId),
    moto_id: parseInt(motoId)
  };

  try {
    const response = await api.post('/chatbot/perguntar', payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar:", error);
    throw error;
  }
};