import React, { use } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Concluido = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: '#D9D9D9',
        p: 7,
        borderRadius: '12px',
        width: '100%',
        maxWidth: '800px',
        margin: '20px auto',
        fontFamily: 'Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minHeight: '300px',
        mt: 6,
      }}
    >
      {/* Header com Ícone e Título */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CheckCircleIcon sx={{ fontSize: 40, color: '#A0A0A0' }} />
        <Typography variant="h5" sx={{ color: '#000', fontWeight: 500 }}>
          Moto salva
        </Typography>
      </Box>

      {/* Texto de Descrição */}
      <Typography variant="body2" sx={{ color: '#000', mb: 5, fontSize: '20px' }}>
        Cadastro realizado com sucesso!
        <br />A moto foi cadastrada e já está disponível para gerenciamento.
      </Typography>

      {/* Botão Centralizado */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#666',
            color: '#FFF',
            textTransform: 'none',
            height: '48px',
            width: '350px',
            borderRadius: '8px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#444',
            },
          }}
          onClick={() => navigate('/listagemMotos')}
        >
          <Typography sx={{ fontSize: '16px' }}>Voltar para Motos</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Concluido;
