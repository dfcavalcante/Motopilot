import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import React from 'react';
import { MotoContext } from './MotoContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { motos, motoSelecionada } = useContext(MotoContext);
  const [chat, setChat] = useState([]);
  const [chatsPorMoto, setChatsPorMoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  const [chatSelecionada, setChatSelecionada] = useState(() => {
    try {
      const stored = localStorage.getItem('chatSelecionada');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erro ao carregar chat selecionado:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (chatSelecionada) {
        localStorage.setItem('chatSelecionada', JSON.stringify(chatSelecionada));
      } else {
        localStorage.removeItem('chatSelecionada');
      }
    } catch (error) {
      console.error('Erro ao salvar chat selecionado:', error);
    }
  }, [chatSelecionada]);
  
  //Mostrar o histórico de mensagens do chatbot por usuário
  const listarChats = useCallback(
    async (usuarioId) => {
      if (!usuarioId) {
        setErro('O Id do usuário é obrigatório para listar o histórico, verificar Chat Context.');
        return [];
      }

      try {
        const response = await fetch(`${BASE_URL}/chatbot/historico/${usuarioId}`);

        if (!response.ok) {
          throw new Error('Erro ao buscar chats');
        }

        const data = await response.json();
        setChat(data);
        return data;
      } catch (error) {
        console.error('Erro no listarChats:', error);
        setErro(error.message);
        return [];
      }
    },
    [BASE_URL]
  );

  // Junta motos e chats por moto_id
  const montarChatsPorMoto = useCallback((listaMotos, listaChats) => {
    const chatsAgrupados = listaChats.reduce((acc, item) => {
      if (!acc[item.moto_id]) {
        acc[item.moto_id] = [];
      }
      acc[item.moto_id].push(item);
      return acc;
    }, {});

    return listaMotos
      .map((moto) => ({
        ...moto,
        chats: chatsAgrupados[moto.id] || [],
      }))
      .filter((moto) => moto.chats.length > 0);
  }, []);

  // Mostrar o histórico de mensagens do chatbot por moto específica
  const listarChatsEspecificos = useCallback(
    async ({ motoId, usuarioId } = {}) => {
      const motoIdFinal = motoId ?? motoSelecionada?.id;

      if (!motoIdFinal) {
        setErro('motoId é obrigatório para listar chats específicos.');
        return { moto: null, chats: [] };
      }

      try {
        const endpoint = usuarioId
          ? `${BASE_URL}/chatbot/historico/${usuarioId}/moto/${motoIdFinal}`
          : `${BASE_URL}/chatbot/historico/moto/${motoIdFinal}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error('Erro ao buscar chats específicos da moto selecionada');
        }

        const data = await response.json();
        setChat(data);

        const motoComChats = motos.find((m) => m.id === motoIdFinal) || null;
        const merge = montarChatsPorMoto(motos, data);
        setChatsPorMoto(merge);

        return { moto: motoComChats, chats: data };
      } catch (error) {
        console.error('Erro no listarChatsEspecificos:', error);
        setErro(error.message);
        return { moto: null, chats: [] };
      }
    },
    [BASE_URL, motoSelecionada, motos, montarChatsPorMoto]
  );

  // Lista histórico do usuário e já entrega motos com seus respectivos chats
  const listarMotosComChats = useCallback(
    async (usuarioId) => {
      if (!usuarioId) {
        setErro('O Id do usuário é obrigatório para montar motos com chats, verificar Chat Context.');
        return [];
      }

      try {
        const chatsUsuario = await listarChats(usuarioId);
        const merge = montarChatsPorMoto(motos, chatsUsuario);
        setChatsPorMoto(merge);
        return merge;
      } catch (error) {
        console.error('Erro no listar motos com os chats:', error);
        setErro(error.message);
        return [];
      }
    },
    [listarChats, montarChatsPorMoto, motos]
  );

  const finalizarConversa = async ({ usuarioId, motoId } = {}) => {
    const motoIdFinal = motoId ?? motoSelecionada?.id;

    if (!usuarioId || !motoIdFinal) {
      setErro('O Id da moto e usuário são obrigatórios para finalizar a conversa.');
      return null;
    }

    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/chatbot/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          moto_id: motoIdFinal,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao finalizar conversa');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro no finalizarConversa:', error);
      setErro(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const limparChat = async (usuarioId) => {
    if (!usuarioId) {
      setErro('O Id do usuário é obrigatório para limpar o chat.');
      return false;
    }

    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/chatbot/limpar/${usuarioId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao limpar chat');
      }

      setChat([]);
      return true;
    } catch (error) {
      console.error('Erro no limparChat:', error);
      setErro(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        chatsPorMoto,
        chatSelecionada,
        setChatSelecionada,
        listarChats,
        listarChatsEspecificos,
        listarMotosComChats,
        finalizarConversa,
        limparChat,
        loading,
        erro,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
