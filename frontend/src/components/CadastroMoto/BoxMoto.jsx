import { Box, Button, Typography, IconButton } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import InformacoesMoto from '../Motos/InformacoesMoto';

const BoxMoto = ({ nomeMoto, numeroDeSerie, ano, onEnter }) => {
  const navigate = useNavigate();

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
        src="images/Motopilot Logo.png"
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
          { 'Ativa'}
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
            {nomeMoto}
          </Typography>
          <Typography variant="body2" color="#484848" mt={1}>
            Nº Série: {numeroDeSerie}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => onEnter({ nome: nomeMoto, serie: numeroDeSerie, ano })} // Chama a função do pai
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
