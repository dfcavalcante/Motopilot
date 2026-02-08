import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const BoxMoto = ({ moto, onEnter }) => {
  const getImageUrl = (caminhoDoBanco) => {
    const caminhoCorrigido = caminhoDoBanco.replace(/\\/g, '/');

    const pathFinal = caminhoCorrigido.startsWith('/')
      ? caminhoCorrigido.slice(1)
      : caminhoCorrigido;

    return `http://localhost:8000/${pathFinal}`;
  };

  return (
    <Box
      sx={{
        border: '2px solid #AEAEAE',
        borderRadius: '16px',
        height: '340px',
        width: '336px',
        backgroundColor: '#AEAEAE',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Imagem de Fundo */}
      <img
        src={getImageUrl(moto.imagem_path)}
        alt="Logo Motopilot"
        style={{ width: '100%', height: '189px', objectFit: 'cover', display: 'block' }}
      />

      {/* Badge de ativo ou n ativo */}
      <Box
        sx={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          bgcolor: '#D9D9D9',
          borderRadius: '16px',
          px: 2,
          height: '15px',
          width: '75px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'black',
            fontSize: '13px',
          }}
        >
          {moto.estado}
        </Typography>
      </Box>

      {/* Conteúdo inferior */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {moto.modelo}
          </Typography>
          <Typography variant="body2" color="#484848" mt={1}>
            Nº Série: {moto.numeroSerie}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => onEnter(moto)}
          sx={{
            bgcolor: '#D9D9D9',
            color: 'black',
            width: '80%',
            borderRadius: '16px',
            textTransform: 'none',
            alignSelf: 'center',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#c4c4c4' },
          }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default BoxMoto;
