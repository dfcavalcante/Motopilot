import React, { use } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography, Button } from '@mui/material';

const Concluido = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#D9D9D9',
        p: 4,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        margin: '20px auto',
        fontFamily: 'Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minHeight: '150px',
        mt: 15,
      }}
    >
      {/* Header com Ícone e Título */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CheckCircleIcon sx={{ fontSize: 40, color: '#A0A0A0' }} />
        <Typography variant="h5" sx={{ color: '#000', fontWeight: 500 }}>
          Usuário salvo
        </Typography>
      </Box>

      {/* Texto de Descrição */}
      <Typography variant="body2" sx={{ color: '#000', mb: 5, fontSize: '20px' }}>
        Cadastro realizado com sucesso!
        <br />A conta foi criada e já pode ser acessada pelo usuário.
      </Typography>
    </Box>
  );
};

export default Concluido;
