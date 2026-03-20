import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';

export const MotoContext = createContext();

export const MotoProvider = ({ children }) => {
  const [motos, setMotos] = useState([]);
  const [modelosMoto, setModelosMoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const hasLoadedMotosRef = useRef(false);
  const hasLoadedModelosRef = useRef(false);

  const BASE_URL = 'http://localhost:8000';

  //Moto para usar do Informações Moto para o Chatbot*/

  const [motoSelecionada, setMotoSelecionada] = useState(() => {
    try {
      const stored = localStorage.getItem('motoSelecionada');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erro ao carregar motoSelecionada:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (motoSelecionada) {
        localStorage.setItem('motoSelecionada', JSON.stringify(motoSelecionada));
      } else {
        localStorage.removeItem('motoSelecionada');
      }
    } catch (error) {
      console.error('Erro ao salvar motoSelecionada:', error);
    }
  }, [motoSelecionada]);

  const [modeloPaiSelecionado, setModeloPaiSelecionado] = useState(() => {
    try {
      const stored = localStorage.getItem('modeloPaiSelecionado');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erro ao carregar modeloPaiSelecionado:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (modeloPaiSelecionado) {
        localStorage.setItem('modeloPaiSelecionado', JSON.stringify(modeloPaiSelecionado));
      } else {
        localStorage.removeItem('modeloPaiSelecionado');
      }
    } catch (error) {
      console.error('Erro ao salvar modeloPaiSelecionado:', error);
    }
  }, [modeloPaiSelecionado]);

  // ------- LISTAR MOTOS ----------
  const listarMotos = useCallback(
    async (force = false) => {
      if (!force && hasLoadedMotosRef.current) {
        return motos;
      }

      try {
        const response = await fetch(`${BASE_URL}/motos/listar`);

        if (!response.ok) {
          throw new Error('Erro ao buscar motos');
        }

        const data = await response.json();
        setMotos(data);
        hasLoadedMotosRef.current = true;
        return data;
      } catch (error) {
        console.error('Erro no listarMotos:', error);
        return [];
      }
    },
    [BASE_URL, motos]
  );

  // ------- LISTAR MODELOS (MOTO PAI) ----------
  const listarModelosMoto = useCallback(
    async (force = false) => {
      if (!force && hasLoadedModelosRef.current) {
        return modelosMoto;
      }

      try {
        const response = await fetch(`${BASE_URL}/motos/modeloMoto/listar`);

        if (!response.ok) {
          throw new Error('Erro ao buscar modelos de motos');
        }

        const data = await response.json();
        setModelosMoto(Array.isArray(data) ? data : []);
        hasLoadedModelosRef.current = true;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Erro no listarModelosMoto:', error);
        setErro(error.message);
        return [];
      }
    },
    [BASE_URL, modelosMoto]
  );

  // ------- ATUALIZAR MOTOS ----------
  const atualizarMoto = async (id, dadosAtualizados) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/motos/${id}/atualizar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || 'Erro ao atualizar moto';
        throw new Error(msg);
      }
      const motoAtualizada = await response.json();
      setMotos((prev) => prev.map((moto) => (moto.id === id ? motoAtualizada : moto)));
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =------ EXCLUIR MOTOS ----------
  const excluirMoto = async (id) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/motos/${id}/deletar`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir moto');
      }
      setMotos((prev) => prev.filter((moto) => moto.id !== id));
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  // consulta backend para verificação de número de série
  const verificarNumeroSerie = async (numeroSerie) => {
    try {
      const response = await fetch(`${BASE_URL}/motos/check/${encodeURIComponent(numeroSerie)}`);
      if (!response.ok) {
        throw new Error('Erro ao verificar número de série');
      }
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Erro no verificarNumeroSerie:', error);
      return false; // em caso de erro, não bloquear
    }
  };

  // ------- CADASTRO DAS MOTOS ----------
  const cadastrarMoto = async (dados) => {
    setLoading(true);
    setErro(null);

    try {
      const isFormData = dados instanceof FormData;

      const headers = {};
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const body = isFormData ? dados : JSON.stringify(dados);

      const response = await fetch(`${BASE_URL}/motos/`, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || 'Erro ao cadastrar moto';
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

  // ------- CADASTRO DO MODELO DE MOTO (MOTO PAI) ----------
  const criarMotoPai = async (dados) => {
    setLoading(true);
    setErro(null);

    try {
      const formData = new FormData();
      formData.append('marca', dados.marca || '');
      formData.append('modelo', dados.modelo || '');

      const response = await fetch(`${BASE_URL}/motos/modeloMoto/criar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || 'Erro ao cadastrar modelo de moto';
        throw new Error(msg);
      }

      const novoModeloMoto = await response.json();
      setModelosMoto((prev) => {
        const existe = prev.some((modelo) => modelo.id === novoModeloMoto.id);
        return existe ? prev : [...prev, novoModeloMoto];
      });
      return novoModeloMoto;
    } catch (error) {
      console.error(error);
      setErro(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---- Gerente atribuição de moto a mecânico ----
  const atribuirMoto = async (motoId, mecanicoId) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/motos/${motoId}/atribuir`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mecanicoId: mecanicoId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atribuir moto');
      }

      const motoAtualizada = await response.json();
      setMotos((prev) => prev.map((moto) => (moto.id === motoId ? motoAtualizada : moto)));
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
    <MotoContext.Provider
      value={{
        motos,
        modelosMoto,
        cadastrarMoto,
        listarMotos,
        listarModelosMoto,
        loading,
        erro,
        excluirMoto,
        atualizarMoto,
        motoSelecionada,
        setMotoSelecionada,
        modeloPaiSelecionado,
        setModeloPaiSelecionado,
        verificarNumeroSerie,
        atribuirMoto,
        criarMotoPai,
      }}
    >
      {children}
    </MotoContext.Provider>
  );
};
