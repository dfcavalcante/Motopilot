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

  const marcarComoLida = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/notificacoes/${id}/marcar_como_lida`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Erro ao atualizar no backend');

      setNotificacoes((notificacoesAntigas) =>
        notificacoesAntigas.map((notificacao) =>
          notificacao.id === id ? { ...notificacao, lido: !notificacao.lido } : notificacao
        )
      );
    } catch (error) {
      console.error('Erro ao alterar o status da notificação:', error);
    }
  };

  const marcarTodasComoLida = async () => {
    try {
      const response = await fetch(`${BASE_URL}/notificacoes/marcar_todas_lidas`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Erro ao atualizar todas no backend');

      setNotificacoes((notificacoesAntigas) =>
        notificacoesAntigas.map((notificacao) => ({
          ...notificacao,
          lido: true,
        }))
      );
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  return (
    <NotificacaoContext.Provider
      value={{
        notificacoes,
        listarNotificacoes,
        loading,
        erro,
        marcarComoLida,
        marcarTodasComoLida,
      }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
};
