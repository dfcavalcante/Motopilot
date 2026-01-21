import { useState } from 'react';
import React from 'react';
import { Box, Stack, TextField, Divider, Grid, Typography, InputAdornment, IconButton } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import HeaderChatBot from '../components/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import SugestaoChatbot from '../components/SugestaoChatbot.jsx';

const Chatbot = () => {
  const [pergunta, setPergunta] = useState('');
  const [nomeChat, setNomeChat] = useState('Nova Conversa');
  
  // Lista de conversas salvas para aparecer na Sidebar
  const [historicoChats, setHistoricoChats] = useState([
    { id: 1, nome: "Pressão dos Pneus" },
    { id: 2, nome: "Troca de óleo" }
  ]);

  const sugestoes = [
    "Qual a pressão dos pneus?",
    "Como fazer a troca de óleo?",
    "O que fazer se a moto não ligar?",
    "O que fazer se o motor não funcionar?"
  ];

  // Função para criar um novo chat e salvar o antigo na lista
  const handleNovoChat = () => {
    if (nomeChat !== "Nova Conversa" && pergunta !== "") {
        const novoHistorico = { id: Date.now(), nome: nomeChat };
        setHistoricoChats([novoHistorico, ...historicoChats]);
    }
    setPergunta('');
    setNomeChat('Nova Conversa');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: "#989898", p: '16px', boxSizing: 'border-box' }}>
      
      {/* Passamos o histórico para a Sidebar exibir */}
      <SideBar historico={historicoChats} />

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}>
        <Stack spacing="8px" sx={{ height: '100%' }}>
          
          <HeaderChatBot 
            nomeChat={nomeChat} 
            setNomeChat={setNomeChat} 
            onNovoChat={handleNovoChat} 
          />

          <Box sx={{ flexGrow: 1, backgroundColor: "white", borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, overflowY: 'auto' }}>
            
            <Typography variant="h6" mb={1} color="grey.700">
                {nomeChat}
            </Typography>

            <Divider sx={{ width: '90%', backgroundColor: 'grey.300', height: '0.4px', mb: 8 }} />

            <Box sx={{ border: '1px solid black', p: 1, borderRadius: '8px', mt: 2 }}>
                <SentimentSatisfiedAltIcon/>
            </Box>

            <Typography variant="body1" gutterBottom color='grey.800' mt={2}>Olá, Tudo bem?</Typography>
            <Typography variant="h4" gutterBottom mb={5} fontWeight={'bold'} textAlign="center">
                Como podemos te ajudar?
            </Typography>

            <Box sx={{ width: '100%', maxWidth: 720, mx: 'auto', mt: 4, mb: 10 }}>
                <TextField
                    fullWidth
                    multiline
                    placeholder="Pergunte alguma coisa..."
                    value={pergunta}
                    onChange={(e) => setPergunta(e.target.value)}
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => console.log("Enviando:", pergunta)}>
                                    <ArrowCircleUpIcon sx={{ color: 'black', fontSize: 30 }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {pergunta.length < 3 && (
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LightbulbOutlinedIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Dúvidas frequentes</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            {sugestoes.map((item, index) => (
                                <Grid item xs={6} key={index}>
                                    <SugestaoChatbot 
                                        sugestao={item} 
                                        onClick={(texto) => setPergunta(texto)} 
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default Chatbot;