import { createContext, useState } from "react";
import React from "react";

export const MotoContext = createContext();

export const MotoProvider = ({ children }) => {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

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

      const response = await fetch("http://localhost:8000/motos/", {
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
      setErro(error.message);
      return false;
    } finally {
      setLoading(false);
    }
};

  return (
    <MotoContext.Provider value={{ motos, cadastrarMoto, loading, erro }}>
      {children}
    </MotoContext.Provider>
  );
};