import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PecaContext = createContext();

export const usePecas = () => {
  return useContext(PecaContext);
};

export const PecaProvider = ({ children }) => {
  const [pecas, setPecas] = useState([]);

  const API_URL = 'http://localhost:8000';

  // listar peças
  const listarPecas = async () => {
    try {
      const response = await axios.get(`${API_URL}/pecas/listar`);
      setPecas(response.data || []);
    } catch (error) {
      console.error('Erro ao listar peças:', error);
    }
  };

  // adicionar peça
  const adicionarPeca = async (pecaData) => {
    try {
      const response = await axios.post(`${API_URL}/pecas/adicionar`, pecaData);
      const nomePeca = response.data?.nome || pecaData?.nome;

      setPecas((prev) => {
        if (!nomePeca || prev.includes(nomePeca)) return prev;
        return [...prev, nomePeca];
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar peça:', error);
      throw error;
    }
  };

  useEffect(() => {
    listarPecas();
  }, []);

  return (
    <PecaContext.Provider
      value={{
        pecas,
        listarPecas,
        adicionarPeca,
      }}
    >
      {children}
    </PecaContext.Provider>
  );
};
