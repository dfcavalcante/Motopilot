import React from 'react';
import { Box, Divider, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SideBar from '../utils/SideBar.jsx';
import ExtendHeader from '../components/Notificacoes/ExtendHeader.jsx';
import BoxNotificacao from '../components/Notificacoes/BoxNotificacao.jsx';

const exemplo = [
  {
    id: 1,
    check: false,
    titulo: 'Titulo da mensagem',
    descricao:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    data: '18 Fev',
  },
  {
    id: 2,
    check: false,
    titulo: 'Outra mensagem',
    descricao: 'Outra descrição de notificação',
    data: '19 Fev',
  },
  {
    id: 3,
    check: false,
    titulo: 'Mais uma mensagem',
    descricao: 'Mais uma descrição de notificação',
    data: '20 Fev',
  },
];
const Notificacoes = () => {
  const navigate = useNavigate();

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
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          ml: '24px',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Header evoluída, tem o perfil, nome e sobrenome do usuário, as notificações */}
        <ExtendHeader>
          <Box
            sx={{
              bgcolor: '#F3F3F3',
              borderRadius: '10px',
              height: '100%',
            }}
          >
            <Box
              display={'flex'}
              mb={3}
              mt={4}
              alignItems="center"
              justifyContent={'center'}
              sx={{ position: 'relative', px: 2 }}
            >
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  position: 'absolute',
                  left: 25,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: '#D9D9D9',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#D9D9D9',
                  },
                }}
              >
                <img src="/images/X.png" alt="Voltar" width="10" height="10" />
              </IconButton>

              <Typography fontSize={30}>Notificações</Typography>
            </Box>

            <Box display={'flex'} mb={2} alignItems="center" justifyContent={'center'} gap={2}>
              <Divider sx={{ width: '85%', bgcolor: 'grey.700', height: '0.4px', mb: 2 }} />
            </Box>

            <Box sx={{ width: '100%', overflowY: 'auto', pb: 2 }}>
              {exemplo.map((notificacao) => (
                <BoxNotificacao
                  key={notificacao.id}
                  check={notificacao.check}
                  titulo={notificacao.titulo}
                  descricao={notificacao.descricao}
                  data={notificacao.data}
                />
              ))}
            </Box>
          </Box>
        </ExtendHeader>
      </Box>
    </Box>
  );
};

export default Notificacoes;
