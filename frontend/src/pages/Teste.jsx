import { useState } from 'react';
import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Container, Box, Stack, Button, TextField, Divider, Grid, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HeaderChatBot from '../components/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { sendChatMessage } from '../context/Chatbot.js';
import ChatMessage from '../components/ChatMessage.jsx';

const Teste = () => {
  const [nomeChat, setNomeChat] = useState('Nome Chat');
  const [pergunta, setPergunta] = useState('');

  const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useState([]); 

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { text: inputValue, isBot: false };
    
    setMessages((prev) => [...prev, userMsg]);
  
    const perguntaTexto = inputValue;
    setInputValue("");

    try {
        const data = await sendChatMessage(perguntaTexto, 1, 1);

        const botMsg = { 
            text: data.resposta, 
            isBot: true 
        };

        setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
        console.error("Erro:", error);
        setMessages((prev) => [...prev, { text: "Erro ao conectar com o servidor.", isBot: true }]);
    }
  };

  return (
  <Box 
    sx={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: "#989898", 
      p: '16px', 
      boxSizing: 'border-box'
    }}
  >
    <SideBar />

    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: 1, 
        ml: '20px', 
        height: '100%'
      }}
    >
      <Stack spacing="8px" sx={{ height: '100%' }}>
        
        <Box sx={{ flexShrink: 0 }}>
          <HeaderChatBot />
        </Box>

        {/* CONTAINER BRANCO PRINCIPAL */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "white",
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            overflow: 'hidden' // <--- MUDANÇA 1: Remove o scroll daqui para o input não sumir
          }}
        >
          <Typography variant="h6" mb={3}>
              {nomeChat}
          </Typography>

          <Divider 
              sx={{ 
                  width: '90%',     
                  backgroundColor: 'grey.700',
                  height: '0.4px',    
                  mb: 2, // Diminuí um pouco a margem para dar espaço     
              }} 
          />

          {/* ÁREA DE MENSAGENS (COM SCROLL) */}
          <Box 
            sx={{ 
                flexGrow: 1,         // Ocupa todo o espaço disponível
                overflowY: 'auto',   // Scroll acontece APENAS aqui
                width: '100%', 
                maxWidth: 720,
                display: 'flex',
                flexDirection: 'column',
                pr: 1 // Um pouco de padding na direita para o scrollbar não colar
            }}
          >
            {messages.map((msg, index) => (
              <ChatMessage key={index} text={msg.text} isBot={msg.isBot} />
            ))}
            {/* Dica: Adicione uma div vazia aqui para auto-scroll funcionar depois */}
          </Box>

          {/* ÁREA DO INPUT (FIXA NO FINAL) */}
          <Box sx={{ width: '100%', maxWidth: 720, mt: 2, flexShrink: 0 }}>
              <TextField
                  sx={{
                  "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "& fieldset": { borderRadius: "10px" },
                      alignItems: 'flex-end'
                  },
                  }}
                  placeholder="Pergunte alguma coisa..."
                  fullWidth
                  multiline
                  onChange={(e) => {
                      setInputValue(e.target.value);
                      setPergunta(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); // Evita pular linha ao enviar
                        handleSend();
                    }
                  }}
                  maxRows={6}
                  variant="outlined"
                  value={pergunta}
                  InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <AddIcon sx={{ color: 'black', cursor:'pointer' }} />
                          </InputAdornment>
                      ),
                      endAdornment: (
                          <InputAdornment position="end">
                              <ArrowCircleUpIcon sx={{ color: 'black', cursor: 'pointer' }} onClick={handleSend} />
                          </InputAdornment>
                      ),
                  }}
              />
          </Box>
        </Box>
      </Stack>
    </Box>
  </Box>
  )
}

export default Teste;