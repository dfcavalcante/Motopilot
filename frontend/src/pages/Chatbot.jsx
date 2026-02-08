import React, { useState } from "react";
import { Box, Stack, Divider, Typography, IconButton } from "@mui/material";
import HeaderChatBot from "../components/ChatBot/HeaderChatbot.jsx";
import SideBar from "../components/SideBar.jsx";
import ChatMessage from "../components/ChatBot/ChatMessage.jsx";
import { useChat } from "../context/useChat.js";
import MotoSelectionDialog from "../components/ChatBot/SeleçãoMoto.jsx";
import ChatInput from "../components/ChatBot/ChatInput.jsx";
import TelaInicial from "../components/ChatBot/TelaInicialChat.jsx";

const Chatbot = () => {
  const {
    motos,
    motoSelecionada,
    setMotoSelecionada,
    messages,
    setMessages, // Importante: Verifique se useChat exporta isso
    carregandoMotos,
    enviarMensagem,
  } = useChat();

  const [input, setInput] = useState("");
  const [modalOpen, setModalOpen] = useState(!motoSelecionada);
  const [nomeChat, setNomeChat] = useState("Nome Chat");
  const [isLoading, setIsLoading] = useState(false);

  // Lógica para resetar a conversa
  const handleNovoChat = () => {
    if (typeof setMessages === "function") {
      setMessages([]); // Limpa o array de mensagens
    }
    setMotoSelecionada(null); // Limpa a moto atual
    setModalOpen(true); // Abre o modal para nova seleção
    setNomeChat("Nome Chat"); // Reseta o nome do chat se desejar
  };

  const handleSendClick = () => {
    if (input.trim()) {
      enviarMensagem(input);
      setInput("");
    }
  };

  const handleSuggestion = (sugestao) => {
    enviarMensagem(sugestao);
    setInput("");
  };


  const sugestoes = [
    "Qual a pressão dos pneus?",
    "Como fazer a troca de óleo?",
    "O que fazer se a moto não ligar?",
    "O que fazer se o motor não funcionar?",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#989898",
        p: "16px",
        boxSizing: "border-box",
      }}
    >
      <SideBar />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          ml: "24px",
          height: "100%",
        }}
      >
        <Stack spacing="8px" sx={{ height: "100%" }}>
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot onNovoChat={handleNovoChat} />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "white",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              overflow: "hidden",
            }}
          >
            <Box display={"flex"} alignItems={"center"} gap={2} mb={2}>
              <Typography fontSize={30}>{nomeChat}</Typography>

              <IconButton
                sx={{
                  padding: "5px", // Ajusta a área de clique
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                }}
              >
                <img
                  src="images/setaChat.png"
                  alt="Editar Chat"
                  width={10}
                  height={7} // Aumentei um pouco para facilitar o clique
                />
              </IconButton>
            </Box>

            <Divider
              sx={{ width: "90%", bgcolor: "grey.700", height: "0.4px" }}
            />

            {/* ÁREA DE MENSAGENS */}
            {messages.length === 0 ? (
              <TelaInicial
                sugestoes={sugestoes}
                onSuggestionClick={handleSuggestion}
              >
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={handleSendClick}
                />
              </TelaInicial>
            ) : (
              <>
                <Box
                  sx={{
                    flexGrow: 1,
                    width: "100%",
                    maxWidth: 720,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    mb: 2,
                  }}
                >
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      text={msg.text}
                      isBot={msg.isBot}
                    />
                  ))}
                  {isLoading && (
                    <Typography variant="caption" sx={{ ml: 2 }}>
                      Digitando...
                    </Typography>
                  )}
                </Box>

                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={handleSendClick}
                />
              </>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Chatbot;
