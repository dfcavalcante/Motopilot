import { createContext, useState } from "react";
import React from "react";

export const MotoContext = createContext();

export const MotoProvider = ({ children }) => {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = "http://localhost:8000";

  {/*Moto para usar do Informações Moto para o Chatbot*/}
  const [motoSelecionada, setMotoSelecionada] = useState(null);



  const listarMotos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/motos/listar`);
            
      if (!response.ok) {
          throw new Error("Erro ao buscar motos");
      }

      const data = await response.json();
        setMotos(data); 
      } catch (error) {
          console.error("Erro no listarMotos:", error);
        }
    };

  const atualizarMoto = async (id, dadosAtualizados) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/motos/${id}/atualizar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || "Erro ao atualizar moto";
        throw new Error(msg);
      }
      const motoAtualizada = await response.json();
      setMotos((prev) =>
        prev.map((moto) => (moto.id === id ? motoAtualizada : moto))
      );
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const excluirMoto = async (id) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/motos/${id}/deletar`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir moto");
      }
      setMotos((prev) => prev.filter((moto) => moto.id !== id));
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
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
    <MotoContext.Provider value={{ motos, cadastrarMoto, listarMotos, loading, erro, excluirMoto, atualizarMoto, motoSelecionada, setMotoSelecionada }}>
      {children}
    </MotoContext.Provider>
  );
};