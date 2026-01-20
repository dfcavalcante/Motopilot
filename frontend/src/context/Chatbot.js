import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', 
});

export const sendChatMessage = async (userMessage) => {
  try {
    const response = await api.post('/chatbot/perguntar', { message: userMessage });
    return response.data;
  } catch (error) {
    console.error("Erro na comunicação com o backend:", error);
    throw error;
  }
};