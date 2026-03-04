import { createContext, useCallback, useState } from 'react';
import React from 'react';

export const NotificacaoContext = createContext();

export const NotificacaoProvider = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  const listarNotificacoes = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/notificacoes/listar`);

      if (!response.ok) {
        throw new Error('Erro ao buscar notificações');
      }

      const data = await response.json();
      setNotificacoes(data);
      return data;
    } catch (error) {
      console.error('Erro no listarNotificacoes:', error);
      setErro(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  const marcarComoLida = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${BASE_URL}/notificacoes/${id}/marcar_como_lida`, {
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Erro ao marcar notificação como lida');
        }

        const notificacaoAtualizada = await response.json();
        setNotificacoes((prev) =>
          prev.map((item) => (item.id === notificacaoAtualizada.id ? notificacaoAtualizada : item))
        );
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        setErro(error.message);
      } finally {
        await listarNotificacoes();
      }
    },
    [BASE_URL, listarNotificacoes]
  );

  return (
    <NotificacaoContext.Provider
      value={{
        notificacoes,
        listarNotificacoes,
        loading,
        erro,
        marcarComoLida,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
};
