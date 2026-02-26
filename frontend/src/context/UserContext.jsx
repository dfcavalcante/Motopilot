import { createContext, useState } from 'react';
import React from 'react';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  // --- LISTAR ---
  const listarUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/listar`);

      if (!response.ok) {
        throw new Error('Erro ao buscar Users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro no listarUsers:', error);
    }
  };

  // --- ATUALIZAR ---
  const atualizarUser = async (id, dadosAtualizados) => {
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
        const msg = errorData.detail || 'Erro ao atualizar User';
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
  };

  // --- EXCLUIR ---
  const excluirUser = async (id) => {
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
  };

// --- VERIFICAÇÕES ---
  const verificarMatricula = async (matricula) => {
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
  };

  const verificarEmail = async (email) => {
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
  };

// --- CADASTRAR ---
  const cadastrarUser = async (dados) => {
    setLoading(true);
    setErro(null);

    try {
      const response = await fetch(`${BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const msg = errorData.detail || 'Erro ao cadastrar User';
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
  };

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
};;;