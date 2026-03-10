import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import React from 'react';
import { MotoContext } from './MotoContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { motos, motoSelecionada, setMotoSelecionada } = useContext(MotoContext);

  // Estados de Dados
  const [chat, setChat] = useState([]); // Histórico bruto
  const [chatsPorMoto, setChatsPorMoto] = useState([]);
  const [messages, setMessages] = useState(() => {
    try {
      const storedMessages = localStorage.getItem('historico_ativo');
      return storedMessages ? JSON.parse(storedMessages) : [];
    } catch (error) {
      console.error('Erro ao carregar mensagens do localStorage', error);
      return [];
    }
  });

  // Estados de UI/Controle
  const [loading, setLoading] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  const sendChatMessage = useCallback(
    async (pergunta, usuarioId, motoId) => {
      const response = await fetch(`${BASE_URL}/chatbot/perguntar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta,
          usuario_id: usuarioId,
          moto_id: motoId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem para o chatbot.');
      }

      return response.json();
    },
    [BASE_URL]
  );

  // Persistência do Chat Selecionado
  const [chatSelecionada, setChatSelecionada] = useState(() => {
    try {
      const stored = localStorage.getItem('chatSelecionada');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (chatSelecionada) {
      localStorage.setItem('chatSelecionada', JSON.stringify(chatSelecionada));
    } else {
      localStorage.removeItem('chatSelecionada');
    }
  }, [chatSelecionada]);

  // --- NOVAS FUNÇÕES INTEGRADAS DO SEU HOOK ---

  const enviarMensagem = async (texto, usuarioId) => {
    // Verifica se o texto não está vazio e se tem uma moto selecionada
    if (!texto?.trim() || !motoSelecionada) return;

    // Se por acaso o usuarioId vier vazio (ex: usuário deslogou no meio), a gente avisa
    if (!usuarioId) {
      console.error('Tentativa de enviar mensagem sem usuário logado!');
      alert('Você precisa estar logado para enviar mensagens.');
      return;
    }

    // 1. Adiciona a mensagem do usuário na tela IMEDIATAMENTE
    const userMsg = { text: texto, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);
    setErro(null);

    // 2. Tenta enviar para o backend
    try {
      // Aqui usamos o usuarioId real que veio lá do Chatbot.jsx
      const data = await sendChatMessage(texto, usuarioId, motoSelecionada.id);

      // 3. Adiciona a resposta do Bot na tela
      const botMsg = { text: data.resposta, isBot: true };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages((prev) => [...prev, { text: 'Erro ao processar resposta.', isBot: true }]);
      setErro('Falha na comunicação com o chatbot.');
    } finally {
      setIsLoadingChat(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('historico_ativo', JSON.stringify(messages));
    } catch (error) {
      console.error('Erro ao salvar mensagens no localStorage', error);
    }
  }, [messages]);

  const trocarMoto = useCallback(() => {
    setMotoSelecionada(null);
    setMessages([]);
    localStorage.removeItem('historico_ativo'); // Limpa a persistência
  }, [setMotoSelecionada]);

  // --- FUNÇÕES DE HISTÓRICO EXISTENTES (OTIMIZADAS) ---

  const listarChats = useCallback(
    async (usuarioId) => {
      if (!usuarioId) return [];
      try {
        const response = await fetch(`${BASE_URL}/chatbot/historico/${usuarioId}`);
        if (!response.ok) throw new Error('Erro ao buscar chats');
        const data = await response.json();
        setChat(data);
        return data;
      } catch (error) {
        setErro(error.message);
        return [];
      }
    },
    [BASE_URL]
  );

  const montarChatsPorMoto = useCallback((listaMotos, listaChats) => {
    const chatsAgrupados = listaChats.reduce((acc, item) => {
      if (!acc[item.moto_id]) acc[item.moto_id] = [];
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

  const listarMotosComChats = useCallback(
    async (usuarioId) => {
      if (!usuarioId) return [];
      setLoading(true);
      try {
        // Busca chats e motos em paralelo para não depender de estado externo
        const [chatsUsuario, motosData] = await Promise.all([
          listarChats(usuarioId),
          fetch(`${BASE_URL}/motos/listar`).then((r) => (r.ok ? r.json() : [])),
        ]);
        const merge = montarChatsPorMoto(motosData, chatsUsuario);
        setChatsPorMoto(merge);
        return merge;
      } finally {
        setLoading(false);
      }
    },
    [listarChats, montarChatsPorMoto, BASE_URL]
  );

  // Carrega um histórico de conversa no chat ativo
  const abrirConversa = useCallback(
    (moto, historico) => {
      const msgs = historico.flatMap((item) => [
        { text: item.pergunta, isBot: false },
        { text: item.resposta_ia, isBot: true },
      ]);
      setMotoSelecionada(moto);
      setMessages(msgs);
    },
    [setMotoSelecionada]
  );

  const finalizarConversa = async ({ usuarioId, motoId } = {}) => {
    const motoIdFinal = motoId ?? motoSelecionada?.id;
    if (!usuarioId || !motoIdFinal) return null;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/chatbot/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, moto_id: motoIdFinal }),
      });
      return await response.json();
    } catch (error) {
      setErro(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const limparChat = async (usuarioId) => {
    if (!usuarioId) return false;
    setLoading(true);
    try {
      await fetch(`${BASE_URL}/chatbot/limpar/${usuarioId}`, { method: 'DELETE' });
      setChat([]);
      setMessages([]); // Também limpa as mensagens da tela
      return true;
    } catch (error) {
      setErro(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        // Estados
        chat,
        messages,
        chatsPorMoto,
        chatSelecionada,
        loading,
        isLoadingChat,
        erro,
        motoSelecionada,
        motos,

        // Funções
        setChatSelecionada,
        setMotoSelecionada,
        enviarMensagem,
        trocarMoto,
        listarChats,
        listarMotosComChats,
        abrirConversa,
        finalizarConversa,
        limparChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
