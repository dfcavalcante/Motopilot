import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import { Container, Box, Input, Button, TextField, Divider, Grid, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HeaderChatBot from '../components/HeaderChatBot.jsx'
import SideBar from '../components/SideBar.jsx';
import SugestaoChatbot from '../components/SugestaoChatbot.jsx';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

const Chatbot = () => {
  const [nomeChat, setNomeChat] = useState('Nome do Chatbot');
  const [pergunta, setPergunta] = useState('');
  const navigate = useNavigate();
  
  const sugestoes = [
    "Qual a pressão dos pneus?",
    "Como fazer a troca de óleo?",
    "O que fazer se a moto não ligar?",
    "O que fazer se o motor não funcionar?"
  ];

    return (
    <Box backgroundColor="#989898" minHeight="100vh" sx={{p: '16px 8px',}}>
        <HeaderChatBot/>

        <Box
            borderRadius={5}
            justifyContent={'center'} 
            alignItems={'center'} 
            sx={{ mt: 2, display: 'flex', flexDirection: 'column'}}
            backgroundColor="white"
        >
            <Typography  variant="h6" mb={3} mt={3}>
                {nomeChat}
            </Typography>

            <Divider 
                sx={{ 
                    width: '90%',     
                    backgroundColor: 'grey.700',
                    height: '0.4px',    
                    mb: 12        
                }} 
            />

            <Box sx={{ 
                border: '1px solid black',
                display: 'inline-flex',   
                p: 1,                     
                borderRadius: '8px'        
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
                    },
                    mb: 3}}
                    label="Pergunte alguma coisa..."
                    fullWidth
                    multiline
                    variant="outlined"
                    value={pergunta}
                    InputProps={{
                        // Ícone no Início
                        startAdornment: (
                            <InputAdornment position="start">
                                <AddIcon sx={{ color: 'black' }} />
                            </InputAdornment>
                        ),
                        // Ícone no Final (Adicione isso aqui)
                        endAdornment: (
                            <InputAdornment position="end">
                                <ArrowCircleUpIcon sx={{ color: 'black', cursor: 'pointer' }} />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => setPergunta(e.target.value)}
                />

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
        </Box>
    </Box>
    )

}

export default Chatbot;