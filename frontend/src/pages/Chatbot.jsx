import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import { Container, Box, Input, Button, TextField, Stack, Grid, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HeaderChatBot from '../components/HeaderChatBot.jsx'
import SideBar from '../components/SideBar.jsx';
import SugestaoChatbot from '../components/SugestaoChatbot.jsx';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

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
    <Box backgroundColor="grey" minHeight="100vh" display="flex" flexDirection="column" alignItems="center">

        <Box
            borderRadius={5}
            justifyContent={'center'} 
            alignItems={'center'} 
            sx={{ mt: 10, display: 'flex', flexDirection: 'column'}}
            backgroundColor="white"
            width={1200}
            height={600}
        >
            <Typography variant="h6" mb={6} mt={10} borderBottom={1}>
                {nomeChat}
            </Typography>

            <Typography variant="body1" gutterBottom color='grey.800'>
            Olá, Tudo bem?
            </Typography>
            <Typography variant="h4" gutterBottom mb={5}>
                Como podemos te ajudar?
            </Typography>

            <TextField
                sx={{
                    
                    "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": {
                        borderRadius: "10px",
                    },},
                }}
                label="Pergunte alguma coisa..."
                fullWidth
                variant="outlined"
                value={pergunta}
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <AddIcon color='black'/>
                    </InputAdornment>
                    ),
                }}
                onChange={(e) => setPergunta(e.target.value)}
            />

            <Box sx={{display: 'flex', flexDirection: 'row', mt: 5,  }}>
                <LightbulbOutlinedIcon/>
                <Typography variant="body1">
                    Dúvidas frequentes
                </Typography>
            </Box>
            
            {sugestoes.map((sugestao, index) => (
                <Grid item xs={6} spacing={2} key={index} sx={{ mt: 2 }}>
                    <SugestaoChatbot sugestao={sugestao} />
                </Grid>
            ))}

        </Box>
    </Box>
        
    )

}

export default Chatbot;