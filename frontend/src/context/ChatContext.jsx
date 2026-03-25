import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import React from 'react';
import { MotoContext } from './MotoContext';
import { getAuthHeaders } from './LoginContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { motos, motoSelecionada, setMotoSelecionada } = useContext(MotoContext);

  // Estados de Dados
  const [chat, setChat] = useState([]); // Histórico bruto
  const [chatsPorMoto, setChatsPorMoto] = useState([]);
  
  // Persistência das mensagens ativas
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('chat_messages');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (messages && messages.length > 0) {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
      } else {
        localStorage.removeItem('chat_messages');
      }
    } catch (error) {
      console.error('Erro ao salvar messages no localStorage', error);
    }
  }, [messages]);

  // Estados de Relatório Final
  const [resumoAtual, setResumoAtual] = useState(null);

  // Estados de UI/Controle
  const [loading, setLoading] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  const sendChatMessage = useCallback(
    async (pergunta, usuarioId, motoId) => {
      const response = await fetch(`${BASE_URL}/chatbot/perguntar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
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

  // --- Funções para o Hook ---

  const enviarMensagem = async (texto, usuarioId) => {
    if (!texto?.trim() || !motoSelecionada) return;

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

  const iniciarNovoChat = useCallback(
    (moto) => {
      setChatSelecionada(null);
      setMotoSelecionada(moto);
      setMessages([]);
      localStorage.removeItem('chat_messages');
      localStorage.removeItem('chatSelecionada');
    },
    [setMotoSelecionada]
  );

  const continuarOuIniciarChat = useCallback(
    (moto) => {
      if (motoSelecionada && motoSelecionada.id === moto.id) {
        // Se já for a moto ativa, não reseta o chat (mantém a persistência)
        return;
      }
      iniciarNovoChat(moto);
    },
    [motoSelecionada, iniciarNovoChat]
  );

  const trocarMoto = useCallback(() => {
    setChatSelecionada(null);
    setMotoSelecionada(null);
    setMessages([]);
    localStorage.removeItem('chat_messages'); // Limpa a persistência
    localStorage.removeItem('chatSelecionada');
  }, [setMotoSelecionada]);

  // --- FUNÇÕES DE HISTÓRICO EXISTENTES (OTIMIZADAS) ---

  const listarChats = useCallback(
    async (usuarioId) => {
      if (!usuarioId) return [];
      try {
        const response = await fetch(`${BASE_URL}/chatbot/historico/${usuarioId}`, {
          headers: { ...getAuthHeaders() },
        });
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

  const finalizarConversa = useCallback(
    async ({ usuarioId, motoId } = {}) => {
      const motoIdFinal = motoId ?? motoSelecionada?.id;
      if (!usuarioId || !motoIdFinal) return null;

      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/chatbot/finalizar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ usuario_id: usuarioId, moto_id: motoIdFinal }),
        });

        if (!response.ok) {
          throw new Error('Erro ao finalizar conversa.');
        }

        const resumo = await response.json();
        setResumoAtual(resumo);
        return resumo;
      } catch (error) {
        console.error('Erro ao finalizar conversa:', error);
        setErro(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, motoSelecionada?.id]
  );

  // Finaliza o chat e cria um relatório no backend
  const finalizarComRelatorio = useCallback(
    async ({ usuarioId, motoId, nomesMecanicos = 'Não especificado' } = {}) => {
      const motoIdFinal = motoId ?? motoSelecionada?.id;
      if (!usuarioId || !motoIdFinal) {
        setErro('Usuário ou Moto não identificados.');
        return null;
      }

      setLoading(true);
      try {
        // 1. Finaliza o chat e obtém o resumo
        const resumo = await finalizarConversa({ usuarioId, motoId: motoIdFinal });

        if (!resumo) {
          throw new Error('Falha ao gerar resumo da conversa.');
        }

        // 2. Cria o relatório no backend
        const payloadRelatorio = {
          cliente_id: usuarioId,
          moto_id: motoIdFinal,
          diagnostico: resumo.diagnostico || '',
          atividades: resumo.atividades || '',
          observacoes: resumo.observacoes || '',
          mecanicos: nomesMecanicos,
          pecas: resumo.pecas || [],
        };

        const responseRelatorio = await fetch(`${BASE_URL}/relatorio/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(payloadRelatorio),
        });

        if (!responseRelatorio.ok) {
          throw new Error('Erro ao salvar relatório.');
        }

        const relatorio = await responseRelatorio.json();
        
        // Limpa o chat ativo localmente após gerar relatório com sucesso
        setChatSelecionada(null);
        setMotoSelecionada(null);
        setMessages([]);
        localStorage.removeItem('chat_messages');
        localStorage.removeItem('chatSelecionada');

        return relatorio;
      } catch (error) {
        console.error('Erro ao finalizar com relatório:', error);
        setErro(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, motoSelecionada?.id, finalizarConversa]
  );

  const limparChat = async (usuarioId) => {
    if (!usuarioId) return false;
    setLoading(true);
    try {
      await fetch(`${BASE_URL}/chatbot/limpar/${usuarioId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
      setChat([]);
      setChatSelecionada(null);
      setMessages([]); // Também limpa as mensagens da tela
      localStorage.removeItem('chat_messages');
      localStorage.removeItem('chatSelecionada');
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
        resumoAtual,

        // Funções
        setChatSelecionada,
        setMotoSelecionada,
        iniciarNovoChat,
        continuarOuIniciarChat,
        enviarMensagem,
        trocarMoto,
        listarChats,
        listarMotosComChats,
        abrirConversa,
        finalizarConversa,
        finalizarComRelatorio,
        limparChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
