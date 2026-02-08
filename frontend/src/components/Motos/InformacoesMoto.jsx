import React from 'react';
import { Box, Stack, Divider, Typography, IconButton, Button, Chip } from '@mui/material';
import HeaderChatBot from '../ChatBot/HeaderChatbot.jsx';
import SideBar from '../SideBar.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const InformacoesMoto = ({ nome, modelo, marca, ano, numeroSerie, descricao }) => {
  const navigate = useNavigate();
  const moto = {
    nome: 'Nome da Moto',
    modelo: 'CB 500F',
    ano: '2026',
    serie: 'HNFDAF323243',
    marca: 'Honda',
    descricao:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel.',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#989898',
        p: '16px',
        boxSizing: 'border-box',
      }}
    >
      <SideBar />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}
      >
        <Stack spacing="8px" sx={{ height: '100%' }}>
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          {/* BOX BRANCA PRINCIPAL */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: 'white',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Cabeçalho Interno */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 2,
              }}
            >
              <IconButton
                sx={{
                  color: '#000000',
                  borderRadius: 2,
                  backgroundColor: '#B5B5B5',
                  width: 40,
                  height: 40,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Typography sx={{ fontSize: 30, fontWeight: 500 }}>Nome Moto</Typography>

              <IconButton
                sx={{
                  color: '#000000',
                  borderRadius: 2,
                  width: 40,
                  height: 40,
                  backgroundColor: '#B5B5B5',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
                }}
              >
                <img src="/images/estrela.png" alt="Estrelinha" width={18} />
              </IconButton>
            </Box>

            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px', mb: 2 }} />

            {/* Chip no canto direito em cima (Dentro da Box Branca) */}
            <Chip
              label="Ativa"
              sx={{
                position: 'absolute',
                top: 120,
                right: 100,
                backgroundColor: '#4E4E4E',
                color: 'white',
                width: '100px',
              }}
            />

            <Box
              sx={{
                width: '95%',
                maxWidth: '1600px',
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 1,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#B5B5B5',
                  color: 'black',
                  top: 300,
                  textTransform: 'none',
                  gap: 1,
                  borderRadius: '16px',
                  padding: '8px 16px',
                  width: '200px',
                  '&:hover': { backgroundColor: '#A5A5A5' },
                }}
              >
                <img src="/images/estrela.png" alt="Estrelinha" width={18} />
                Chat da Moto
              </Button>
            </Box>

            {/* BOX DA IMAGEM CENTRALIZADA */}
            <Box
              sx={{
                border: '1px solid #A0A0A0',
                borderRadius: '16px',
                width: '380px',
                height: 270,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 2,
                mb: 4,
              }}
            >
              <img src="/images/Imagem.png" alt="Imagem Moto" style={{ width: '110px' }} />
            </Box>

            {/* Box das Informações (Cinza) */}
            <Box
              sx={{
                bgcolor: '#D9D9D9',
                borderRadius: '16px',
                p: 4,
                width: '95%',
                maxWidth: '1600px',
                minHeight: '320px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={2} sx={{ flex: 2 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 30 }}>{moto.nome}</Typography>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#555', display: 'block', fontSize: 16 }}
                    >
                      Número de Série
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 20 }}>
                      {moto.serie}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={2} sx={{ flex: 1 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#555', display: 'block', fontSize: 16 }}
                    >
                      Modelo
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {moto.modelo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#555', display: 'block', fontSize: 16 }}
                    >
                      Marca
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {moto.marca}
                    </Typography>
                  </Box>
                </Stack>

                <Stack sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#555', display: 'block', fontSize: 16 }}
                  >
                    Ano
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '700' }}>
                    {moto.ano}
                  </Typography>
                </Stack>
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Descrição da máquina
                </Typography>
                <Typography variant="body2" sx={{ color: '#444', textAlign: 'justify' }}>
                  {moto.descricao}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default InformacoesMoto;
