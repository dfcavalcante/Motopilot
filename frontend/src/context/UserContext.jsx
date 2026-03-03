import { createContext, useState, useCallback } from 'react';
import React from 'react';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  const extrairMensagemErro = (errorData, fallback) => {
    if (!errorData) return fallback;

    const { detail } = errorData;
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (item?.msg) {
            const caminho = Array.isArray(item.loc) ? item.loc.join('.') : '';
            return caminho ? `${caminho}: ${item.msg}` : item.msg;
          }
          return String(item);
        })
        .join(' | ');
    }

    if (typeof detail === 'string') {
      return detail;
    }

    return fallback;
  };

  // --- LISTAR ---
  const listarUsers = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/listar`);

      if (!response.ok) {
        throw new Error('Erro ao buscar Users');
      }

      const data = await response.json();
      setUsers(data);
      return data;
    } catch (error) {
      console.error('Erro no listarUsers:', error);
      return [];
    }
  }, [BASE_URL]);

  // --- ATUALIZAR ---
  const atualizarUser = useCallback(async (id, dadosAtualizados) => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/users/${id}/atualizar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = extrairMensagemErro(errorData, 'Erro ao atualizar User');
        throw new Error(msg);
      }
      const UserAtualizada = await response.json();
      setUsers((prev) => prev.map((User) => (User.id === id ? UserAtualizada : User)));
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EXCLUIR ---
  const excluirUser = useCallback(
    async (id) => {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`${BASE_URL}/users/${id}/deletar`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Erro ao excluir User');
        }
        setUsers((prev) => prev.filter((User) => User.id !== id));
      } catch (error) {
        console.error(error);
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL]
  );

  // --- VERIFICAÇÕES ---
  const verificarMatricula = useCallback(
    async (matricula) => {
      try {
        const response = await fetch(`${BASE_URL}/users/check/${encodeURIComponent(matricula)}`);
        if (!response.ok) {
          throw new Error('Erro ao verificar matrícula');
        }
        const data = await response.json();
        return data.exists;
      } catch (error) {
        console.error('Erro no verificar matrícula:', error);
        return false;
      }
    },
    [BASE_URL]
  );

  const verificarEmail = useCallback(
    async (email) => {
      try {
        const response = await fetch(`${BASE_URL}/users/check-email/${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error('Erro ao verificar email');
        }
        const data = await response.json();
        return data.exists;
      } catch (error) {
        console.error('Erro no verificar email:', error);
        return false;
      }
    },
    [BASE_URL]
  );

  // --- CADASTRAR ---
  const cadastrarUser = useCallback(
    async (dados) => {
      setLoading(true);
      setErro(null);

      try {
        const payload = {
          nome: dados.nomeCompleto,
          email: dados.email,
          matricula: dados.numeroMatricula,
          funcao: dados.funcao,
          senha: dados.senha,
        };

        const response = await fetch(`${BASE_URL}/users/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const msg = extrairMensagemErro(errorData, 'Erro ao cadastrar User');
          throw new Error(msg);
        }

        const novaUser = await response.json();
        setUsers((prev) => [...prev, novaUser]);
        return true;
      } catch (error) {
        console.error(error);
        setErro(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL]
  );

  return (
    <UsersContext.Provider
      value={{
        users,
        cadastrarUser,
        listarUsers,
        loading,
        erro,
        excluirUser,
        atualizarUser,
        verificarMatricula,
        verificarEmail,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
