import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SugestaoChatbot from './SugestaoChatbot';

//A tela inicial do chatbot, que exibe uma saudação, um input e sugestões de dúvidas frequentes
const TelaInicialChat= ({ sugestoes, onSuggestionClick, children }) => {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', width: '100%', maxWidth: 720 }}>
        <Box sx={{ border: '1px solid black', display: 'inline-flex', p: 1, borderRadius: '8px', mb: 2 }}>
            <img src="/images/smile_face.png" alt="Logo" width="15" />
        </Box>

        <Typography variant="body1" gutterBottom color='grey.800'>Olá, Tudo bem?</Typography>
        <Typography variant="h4" gutterBottom mb={3} fontWeight={500}>Como podemos te ajudar?</Typography>

        {/* Aqui renderizamos o Input que virá como filho */}
        {children} 

        <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LightbulbOutlinedIcon fontSize="small" />
                <Typography variant="body1" >Dúvidas frequentes</Typography>
            </Box>
            
            <Grid container spacing={2}>
                {sugestoes.slice(0, 4).map((sugestao, index) => (
                <Grid item xs={6} key={index}>
                    <div onClick={() => onSuggestionClick(sugestao)} style={{ cursor: 'pointer' }}>
                        <SugestaoChatbot sugestao={sugestao} sx={{ width: '100%' }} />
                    </div>
                </Grid>
                ))}
            </Grid>
        </Box>
    </Box>
  );
};

export default TelaInicialChat;