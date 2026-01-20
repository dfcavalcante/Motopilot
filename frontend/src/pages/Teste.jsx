import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import { Container, Box, Stack, Button, TextField, Divider, Grid, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HeaderChatBot from '../components/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import SugestaoChatbot from '../components/SugestaoChatbot.jsx';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { sendChatMessage } from '../context/Chatbot.js';
import ChatMessage from '../components/ChatMessage.jsx';

const Teste = () => {
  const [nomeChat, setNomeChat] = useState('Nome Chat');
  const [pergunta, setPergunta] = useState('');

  const isPerguntando = pergunta.length > 10;

  const [inputValue, setInputValue] = useState("");
	const [messages, setMessages] = useState([]); // Histórico para exibir na tela

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // 1. Cria a mensagem do usuário
    const userPrompt = inputValue;
    setMessages(prev => [...prev, { text: userPrompt, isBot: false }]);
    setInputValue("");

    try {
      // 2. Chama seu Router/Service do Backend
      // Supondo que sua API retorna { answer: "..." }
      const response = await sendChatMessage(userPrompt); 

      // 3. Adiciona a resposta da IA
      setMessages(prev => [...prev, { text: response.pergunta, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Erro ao processar resposta.", isBot: true }]);
    }
	}
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
              overflowY: 'auto'
            }}
          >
            <Typography  variant="h6" mb={3}>
                {nomeChat}
            </Typography>

            <Divider 
                sx={{ 
                    width: '90%',     
                    backgroundColor: 'grey.700',
                    height: '0.4px',    
                    mb: 10,     
                }} 
            />


            <Box sx={{ width: '100%', maxWidth: 720}}>
							{messages.map((msg, index) => (
							<ChatMessage key={index} text={msg.text} isBot={msg.isBot} />
							))}

                <TextField
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "& fieldset": { borderRadius: "10px" },
                        alignItems: 'flex-end'
                    },
                    mb: 3}}
                    placeholder="Pergunte alguma coisa..."
                    fullWidth
                    multiline
										onChange={(e) => {
												setInputValue(e.target.value);
												setPergunta(e.target.value);
										}}
         						onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    maxRows={6}
                    variant="outlined"
                    value={pergunta}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Button >
                                    <AddIcon sx={{ color: 'black', cursor:'pointer' }} />
                                </Button>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={handleSend}>
                                    <ArrowCircleUpIcon sx={{ color: 'black', cursor: 'pointer' }} />
                                </Button>
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