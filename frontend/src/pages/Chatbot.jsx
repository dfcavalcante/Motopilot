import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Stack, Button, TextField, Divider, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HeaderChatBot from '../components/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import SugestaoChatbot from '../components/SugestaoChatbot.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { sendChatMessage } from '../context/Chatbot.js';

const Chatbot = () => {
  
  const [nomeChat, setNomeChat] = useState('Novo Chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sugestoes = [
    "Qual a pressão dos pneus?",
    "Como fazer a troca de óleo?",
    "O que fazer se a moto não ligar?",
    "O que fazer se o motor não funcionar?"
  ];

  const handleSend = async (textoParaEnviar = input) => {
    if (!textoParaEnviar || textoParaEnviar.trim() === "") return;

    const userMsg = { text: textoParaEnviar, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    
    setInput("");
    setIsLoading(true);

    try {
        const data = await sendChatMessage(textoParaEnviar, 1, 1);
        const botMsg = { text: data.resposta, isBot: true };
        setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
        console.error("Erro:", error);
        setMessages((prev) => [...prev, { text: "Erro ao conectar com o servidor.", isBot: true }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSuggestionClick = (texto) => {
      handleSend(texto);
  };

  // A área de perguntar do chatr
  const inputArea = (
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
            maxRows={6}
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <AddIcon sx={{ color: 'black', cursor:'pointer' }} />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                      <ArrowCircleUpIcon sx={{ color: 'black', cursor: 'pointer' }} onClick={() => handleSend()} />
                    </InputAdornment>
                ),
            }}
        />
    </Box>
  );

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

          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "white",
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              overflow: 'hidden'
            }}
          >
            <Typography variant="h6" mb={2}>
                {nomeChat}
            </Typography>

            <Divider 
                sx={{ 
                    width: '90%',     
                    backgroundColor: 'grey.700',
                    height: '0.4px',    
                    mb: 2,     
                }} 
            />

            {messages.length === 0 ? (
                <Box sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center', 
                    overflowY: 'auto',
                    width: '100%',
                    maxWidth: 720
                }}>
                    <Box sx={{ 
                        border: '1px solid black',
                        display: 'inline-flex',   
                        p: 1,                     
                        borderRadius: '8px',
                        mb: 2    
                    }}>
                        <SentimentSatisfiedAltIcon/>
                    </Box>

                    <Typography variant="body1" gutterBottom color='grey.800'>
                        Olá, Tudo bem?
                    </Typography>
                    <Typography variant="h4" gutterBottom mb={3} fontWeight={'bold'}>
                        Como podemos te ajudar?
                    </Typography>

                    {inputArea} 

                    <Box sx={{ width: '100%', mt: 5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LightbulbOutlinedIcon fontSize="small" />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Dúvidas frequentes
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            {sugestoes.slice(0, 4).map((sugestao, index) => (
                            <Grid item xs={6} key={index}>
                                <div onClick={() => handleSuggestionClick(sugestao)} style={{ cursor: 'pointer' }}>
                                    <SugestaoChatbot sugestao={sugestao} sx={{ width: '100%' }} />
                                </div>
                            </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            ) : (
                /*Parte da conversa */
                <>
                    <Box 
                        sx={{ 
                            flexGrow: 1, 
                            width: '100%', 
                            maxWidth: 720,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            mb: 2
                        }}
                    >
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} text={msg.text} isBot={msg.isBot} />
                        ))}
                        {isLoading && <Typography variant="caption" sx={{ ml: 2 }}>Digitando...</Typography>}
                    </Box>

                    {inputArea}
                </>
            )}

          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default Chatbot;