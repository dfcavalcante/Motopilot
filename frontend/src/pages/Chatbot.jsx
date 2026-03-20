import React, { useState, useRef, useEffect, useContext } from 'react';
import { Box, Button, Divider, Typography, IconButton } from '@mui/material';
import { useLogin } from '../context/LoginContext.jsx';
import ChatInput from '../components/ChatBot/ChatInput.jsx';
import TelaInicial from '../components/ChatBot/TelaInicialChat.jsx';
import ChatMessage from '../components/ChatBot/ChatMessage.jsx';
import HistoricoPanel from '../components/ChatBot/HistoricoPanel.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import Loading from '../components/ChatBot/Loading.jsx';
import { ChatContext } from '../context/ChatContext.jsx';
import BaseFrontChat from '../components/ChatBot/BaseFrontChat.jsx';
import BotaoFinalizar from '../components/ChatBot/BotaoFinalizar.jsx';

const Chatbot = () => {
  const {
    motoSelecionada,
    messages,
    enviarMensagem,
    isLoadingChat,
    limparChat,
    trocarMoto,
    chatsPorMoto,
    loading: loadingHistorico,
    listarMotosComChats,
    abrirConversa,
    finalizarComRelatorio,
  } = useContext(ChatContext);
  const { user } = useLogin();

  const [input, setInput] = useState('');
  const [showHistorico, setShowHistorico] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      listarMotosComChats(user.id);
    }
  }, [user?.id]);

  const nomeChat = motoSelecionada ? `${motoSelecionada.modelo}` : 'Novo Chat';
  const estadoAtualMoto = String(motoSelecionada?.estado || '')
    .trim()
    .toLowerCase();
  const motoConcluida = estadoAtualMoto === 'concluida' || estadoAtualMoto === 'concluída';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingChat]);

  const handleNovoChat = async () => {
    const usuarioId = user?.id;

    if (!usuarioId) {
      alert('Você precisa estar logado!');
      return;
    }

    const confirmou = window.confirm('Deseja limpar o histórico e iniciar um novo chat?');
    if (confirmou) {
      await limparChat(usuarioId);
      trocarMoto();
    }
  };

  const handleSendClick = () => {
    if (motoConcluida) {
      alert('Esta moto já foi concluída e não aceita novas mensagens no chat.');
      return;
    }

    if (input.trim()) {
      enviarMensagem(input, user?.id);
      setInput('');
    }
  };

  // Função para finalizar conversa e criar relatório
  const handleFinalizarAtendimento = async () => {
    if (!user?.id || !motoSelecionada?.id) {
      alert('Usuário ou Moto não identificados!');
      return null;
    }

    const relatorio = await finalizarComRelatorio({
      usuarioId: user.id,
      motoId: motoSelecionada.id,
      nomesMecanicos: user.nome || 'Não especificado',
    });

    return relatorio;
  };

  const handleSuggestion = (sugestao) => {
    enviarMensagem(sugestao, user?.id);
  };

  const sugestoes = [
    'Qual a pressão dos pneus?',
    'Como fazer a troca de óleo?',
    'O que fazer se a moto não ligar?',
    'O que fazer se o motor não funcionar?',
  ];

  return (
    <BaseFrontChat>
      <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Painel de Histórico (condicional) */}
        {showHistorico && (
          <HistoricoPanel
            chatsPorMoto={chatsPorMoto}
            loading={loadingHistorico}
            onSelectMoto={(moto, chats) => {
              abrirConversa(moto, chats);
              setShowHistorico(false);
            }}
          />
        )}

        {/* Área principal do chat */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {/* Header Interno do Chat */}
          <Box
            display="flex"
            mb={2}
            alignItems="center"
            width="100%"
            px={5}
            position="relative"
            justifyContent="center"
          >
            <IconButton
              onClick={() => window.history.back()}
              sx={{
                color: '#000000',
                borderRadius: 2,
                backgroundColor: '#B5B5B5',
                width: 40,
                height: 40,
                position: 'absolute',
                left: 0,
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography fontSize={30}>{nomeChat}</Typography>

            {messages.length > 0 && !motoConcluida && (
              <Box sx={{ position: 'absolute', right: 60 }}>
                <BotaoFinalizar onFinalizar={handleFinalizarAtendimento} />
              </Box>
            )}

            {/* Botão de toggle do histórico */}
            <IconButton
              onClick={() => setShowHistorico((prev) => !prev)}
              sx={{
                color: showHistorico ? '#fff' : '#000000',
                borderRadius: 2,
                backgroundColor: showHistorico ? '#676767' : '#B5B5B5',
                width: 40,
                height: 40,
                position: 'absolute',
                right: 0,
                '&:hover': { backgroundColor: showHistorico ? '#444' : 'rgba(0, 0, 0, 0.2)' },
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Box>

          <Divider sx={{ width: '100%', bgcolor: 'grey.700', mb: 2 }} />

          {/* Renderização Condicional: Tela Inicial ou Mensagens */}
          {!motoSelecionada || messages.length === 0 ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TelaInicial sugestoes={sugestoes} onSuggestionClick={handleSuggestion}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <ChatInput
                    input={input}
                    setInput={setInput}
                    onSend={handleSendClick}
                    disabled={!motoSelecionada || motoConcluida}
                  />
                </Box>
                {motoConcluida && (
                  <Typography sx={{ mt: 1, color: '#4E4E4E', fontSize: 14 }}>
                    Atendimento concluído. O chat desta moto está bloqueado.
                  </Typography>
                )}
              </TelaInicial>
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1,
                overflow: 'hidden',
              }}
            >
              {/* Caixa das Mensagens */}
              <Box
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  maxWidth: 720,
                  display: 'flex',
                  flexDirection: 'column',
                  mb: 2,
                  overflowY: 'auto',
                }}
              >
                {messages.map((msg, index) => (
                  <ChatMessage key={index} text={msg.text} isBot={msg.isBot} />
                ))}
                {isLoadingChat && <Loading />}
                <div ref={messagesEndRef} />
              </Box>

              {/* Caixa do Input */}
              <Box sx={{ width: '100%', maxWidth: 720, mb: 2 }}>
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={handleSendClick}
                  disabled={motoConcluida}
                />
              </Box>
              {motoConcluida && (
                <Typography sx={{ mb: 2, color: '#4E4E4E', fontSize: 14 }}>
                  Atendimento concluído. O chat desta moto está bloqueado.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </BaseFrontChat>
  );
};

export default Chatbot;
