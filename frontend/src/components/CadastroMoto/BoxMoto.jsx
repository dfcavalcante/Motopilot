import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const BoxMoto = ({ moto, onEnter, tipo = 'filha', mecanicoNome }) => {
  const fallbackSrc = '/images/Motopilot.jpeg';

  const getImageUrl = (caminhoDoBanco) => {
    if (!caminhoDoBanco) {
      return fallbackSrc;
    }

    const caminhoCorrigido = caminhoDoBanco.replace(/\\/g, '/');

    const pathFinal = caminhoCorrigido.startsWith('/')
      ? caminhoCorrigido.slice(1)
      : caminhoCorrigido;

    return `http://localhost:8000/${pathFinal}`;
  };

  const numeroSerie = moto.numeroSerie || moto.numero_serie;
  const titulo = moto.modelo || 'Modelo sem nome';
  const subtitulo =
    tipo === 'pai' ? `Marca: ${moto.marca || '-'}` : `Nº Série: ${numeroSerie || '-'}`;
  const estado = tipo === 'pai' ? 'Modelo' : moto.estado;

  const imagemMoto = moto.imagemPath || moto.imagem_moto || moto.imagemMoto;

  return (
    <Box
      sx={{
        borderRadius: '16px',
        height: '340px',
        width: '336px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 3
      }}
    >
      {/* Imagem de Fundo */}
      <img
        src={getImageUrl(imagemMoto)}
        alt="Logo Motopilot"
        onError={(event) => {
          if (event.currentTarget.src !== fallbackSrc) {
            event.currentTarget.src = fallbackSrc;
          }
        }}
        style={{ width: '100%', height: '189px', objectFit: 'cover', display: 'block' }}
      />


      {/* Conteúdo inferior */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {titulo}
          </Typography>
          <Typography variant="body2" color="#484848">
            Aq tem q adicionar a quantidade de motos que tem desse modelo, ver no backend
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => onEnter(moto)}
          sx={{
            mt: 'auto',
            bgcolor: '#F30000',
            color: 'white',
            width: '80%',
            borderRadius: '16px',
            textTransform: 'none',
            alignSelf: 'center',
          }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default BoxMoto;
