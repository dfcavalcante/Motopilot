import { createContext, useState } from "react";
import React from "react";

export const RelatorioContext = createContext();

export const RelatorioProvider = ({ children }) => {
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = "http://localhost:8000";

  /*const listarRelatorios = async () => {
    try {
        const response = await fetch(`${BASE_URL}/relatorios/listar`);
        
        if (!response.ok) {
            throw new Error("Erro ao buscar relatórios");
        }

        const data = await response.json();
        setRelatorio(data);
        return data; // Retorna os dados para o useChat usar
    } catch (error) {
        console.error("Erro no listar_relatorios:", error);
        return []; // Retorna array vazio para não quebrar o loop do chat
    }
  };*/

  const atualizarRelatorio = async (id, dadosAtualizados) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/relatorios/${id}/atualizar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || "Erro ao atualizar relatório";
        throw new Error(msg);
      }
      const relatorioAtualizado = await response.json();
      setRelatorio((prev) =>
        prev.map((relatorio) => (relatorio.id === id ? relatorioAtualizado : relatorio))
      );
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const excluirRelatorio = async (id) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/relatorios/${id}/deletar`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir relatório");
      }
      setRelatorio((prev) => prev.filter((relatorio) => relatorio.id !== id));
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const salvarRelatorio = async (dados) => { 
    setLoading(true);
    setErro(null);

    try {
      let body;
      const headers = {
        "Content-Type": "application/json" // Vamos forçar JSON
      };

      if (dados instanceof FormData) {
        // 1. Converte FormData para Objeto JS
        const dadosObjeto = Object.fromEntries(dados.entries());
        
        //Ocorre a conversão do campo 'moto' para 'moto_id' como int
        if (dadosObjeto.moto) {
            dadosObjeto.moto_id = parseInt(dadosObjeto.moto); 
            // Opcional: remove o campo antigo 'moto' para não confundir o backend
            delete dadosObjeto.moto; 
        }

        // Se o valor estiver vazio ou inválido, o backend vai reclamar.
        // Garante que é um número válido antes de enviar
        if (!dadosObjeto.moto_id || isNaN(dadosObjeto.moto_id)) {
            throw new Error("Por favor, selecione uma moto válida.");
        }
        // ---------------------

        body = JSON.stringify(dadosObjeto);
      } else {
        body = JSON.stringify(dados);
      }

      const response = await fetch(`${BASE_URL}/relatorios/criar`, {
        method: "POST",
        headers: headers, // Agora sempre enviamos o header de JSON
        body: body,       
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Erro retornado pelo servidor:", errorData);
        
        // Tratamento para ler erros de validação do Pydantic/FastAPI
        let errorMsg = errorData.detail || errorData.message || "Erro desconhecido";
        if (typeof errorMsg === 'object') {
            errorMsg = JSON.stringify(errorMsg, null, 2);
        }
        throw new Error(errorMsg);
      }

      const novoRelatorio = await response.json();
      return true;

    } catch (error) {
      console.error("Erro capturado:", error);
      setErro(error.message); 
      return false;
    } finally {
      setLoading(false);
    }
};

  return (
    <RelatorioContext.Provider value={{ relatorio, salvarRelatorio, loading, erro, excluirRelatorio, atualizarRelatorio}}>
      {children}
    </RelatorioContext.Provider>
  );
};