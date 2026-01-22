import { createContext, useState } from "react";
import React from "react";

export const MotoContext = createContext();

export const MotoProvider = ({ children }) => {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = "http://localhost:8000";

  const listar_motos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/motos/`);
        
        if (!response.ok) {
            throw new Error("Erro ao buscar motos");
        }

        const data = await response.json();
        setMotos(data);
        return data; // Retorna os dados para o useChat usar
    } catch (error) {
        console.error("Erro no listar_motos:", error);
        return []; // Retorna array vazio para não quebrar o loop do chat
    }
  };

  const cadastrarMoto = async (dados) => { 
    setLoading(true);
    setErro(null);

    try {
      const isFormData = dados instanceof FormData;
      
      const headers = {};
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const body = isFormData ? dados : JSON.stringify(dados);

      const response = await fetch(`${BASE_URL}/motos/`, {
        method: "POST",
        headers: headers, 
        body: body,       
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || "Erro ao cadastrar moto";
        throw new Error(msg);
      }

      const novaMoto = await response.json();
      setMotos((prev) => [...prev, novaMoto]);
      return true;

    } catch (error) {
      console.error(error);
      setErro(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotoContext.Provider value={{ motos, cadastrarMoto, listar_motos, loading, erro }}>
      {children}
    </MotoContext.Provider>
  );
};