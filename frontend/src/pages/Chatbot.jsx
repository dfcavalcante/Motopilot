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

const Chatbot = () => {
  const [nomeChat, setNomeChat] = useState('Nome Chat');
  const [pergunta, setPergunta] = useState('');
  const navigate = useNavigate();
  
  const isPerguntando = pergunta.length > 10;

  const sugestoes = [
    "Qual a pressão dos pneus?",
    "Como fazer a troca de óleo?",
    "O que fazer se a moto não ligar?",
    "O que fazer se o motor não funcionar?"
  ];

    return (
   <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: "#989898", 
        p: '16px', // Padding de 16px em toda a borda da tela
        boxSizing: 'border-box'
      }}
    >
      {/* 1. SIDEBAR: Agora ela é um item do flexbox */}
      <SideBar />

      {/* 2. ÁREA DA DIREITA (Header + Chat) */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          ml: '20px', // Espaçamento de 8px entre a Sidebar e o conteúdo
          height: '100%'
        }}
      >
        {/* Usamos Stack para garantir que o Header e o Chat tenham 8px entre eles */}
        <Stack spacing="8px" sx={{ height: '100%' }}>
          
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "white",
              borderRadius: '20px', // Arredondado conforme seu protótipo
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

            <Box sx={{ 
                border: '1px solid black',
                display: 'inline-flex',   
                p: 1,                     
                borderRadius: '8px',
                mt: 2    
            }}>
                <SentimentSatisfiedAltIcon/>
            </Box>
            

            <Typography variant="body1" gutterBottom color='grey.800' mt={2}>
            Olá, Tudo bem?
            </Typography>
            <Typography variant="h4" gutterBottom mb={5} fontWeight={'bold'}>
                Como podemos te ajudar?
            </Typography>

            <Box sx={{ width: '100%', maxWidth: 720, mx: 'auto', mt: 4, mb: 10}}>
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
                    maxRows={6}
                    variant="outlined"
                    value={pergunta}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Button>
                                    <AddIcon sx={{ color: 'black', cursor:'pointer' }} />
                                </Button>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <ArrowCircleUpIcon sx={{ color: 'black', cursor: 'pointer' }} />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => setPergunta(e.target.value)}
                />

                {!isPerguntando && (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LightbulbOutlinedIcon fontSize="small" />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Dúvidas frequentes
                            </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {sugestoes.slice(0, 4).map((sugestao, index) => (
                        <Grid item xs={6} key={index}>
                            <SugestaoChatbot sugestao={sugestao} sx={{ width: '100%' }} />
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
    )

}

export default Chatbot;