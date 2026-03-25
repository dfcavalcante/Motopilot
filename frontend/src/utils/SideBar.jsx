import React from 'react';
import { Box, Typography, Stack, Divider, Button, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const SideBar = ({ historico = [] }) => {
  const [open, setOpen] = React.useState(false); //Mudei pq tava #foda
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    {
      name: 'Início',
      link: '/dashboard',
      icon: <img src="/images/Home.svg" alt="Logo" width="20" />,
    },
    {
      name: 'Chatbot',
      link: '/chatbot',
      icon: <img src="/images/IA.png" alt="Logo" width="20" />,
    },
    {
      name: 'Motos',
      link: '/listagemMotos',
      icon: <img src="/images/Folder.svg" alt="Logo" width="20" />,
    },
    {
      name: 'Relatórios',
      link: '/relatorios',
      icon: <img src="/images/report.png" alt="Logo" width="20" />,
    },

    {
      name: 'Usuários',
      link: '/usuarios',
      icon: <img src="/images/users.png" alt="Logo" width="25" />,
    },
  ];

  {
    open && (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'grey.500',
            fontWeight: 'bold',
            mb: 1,
            display: 'block',
            ml: 1,
          }}
        >
          CONVERSAS RECENTES
        </Typography>
        <Stack spacing={0.5}>
          {historico.length > 0 ? (
            historico.map((chat) => (
              <Box
                key={chat.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: 'grey.600' }} />
                <Typography variant="body2" noWrap sx={{ color: 'grey.800' }}>
                  {chat.nome}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="caption" sx={{ color: 'grey.400', fontStyle: 'italic', ml: 1 }}>
              Nenhuma conversa recente
            </Typography>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: open ? '260px' : '80px',
        transition: 'width 0.3s ease',
        height: '100%',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        p: '20px',
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: 6
      }}
    >
      {/* Botão de abrir/fechar */}
      <Button
        onClick={() => setOpen(!open)}
        sx={{
          position: 'absolute',
          right: -12,
          top: 90,
          backgroundColor: '#F30000',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          zIndex: 10,
          minWidth: '20px',
          height: '20px',
          borderRadius: '24',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: '#DBDBDB',
            boxShadow: 3,
          },
        }}
      >
        <img
          src={open ? '/images/leftAbrir.png' : '/images/rightFechar.png'}
          alt={open ? 'Fechar' : 'Abrir'}
          style={{
            width: '8px',
            height: 'auto',
            display: 'block',
          }}
        />
      </Button>

      <Stack spacing={2} sx={{ height: '100%', overflow: 'hidden' }}>
        {/* Logo */}
        <IconButton
          onClick={() => navigate('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center',
            gap: 18,
            minHeight: '40px',
            '&:hover': {
              transform: 'none',
              backgroundColor: 'transparent',
            },
          }}
        >
          {!open && <img src="/images/LogoNova.png" alt="Logo" width="45" />}
          {open && (
            <img
              src="/images/LogoNovaGrande.png"
              alt="Logo"
              width="220"
              height={30}
              style={{ borderRadius: '8px' }}
            />
          )}
        </IconButton>

        <Divider />

        {/* CONTAINER PRINCIPAL (Scrollable) */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            pr: open ? 1 : 0, // Espaço para não sobrepor a scrollbar no texto
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#e0e0e0',
              borderRadius: '10px',
            },
          }}
        >
          {/* 2. MENUS DE NAVEGAÇÃO (Logo abaixo do histórico) */}
          <Box sx={{ mt: 5 }}>
            {menus.map((menu, index) => (
              <Box
                key={index}
                onClick={() => navigate(menu.link)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '12px',
                  mb: 0.5,
                  justifyContent: open ? 'flex-start' : 'center',

                  backgroundColor: location.pathname === menu.link ? '#FEDCDB' : 'transparent',
                  color: location.pathname === menu.link,
                  '&:hover': {
                    backgroundColor: location.pathname === menu.link ? '#d5d5d5' : '#f5f5f5',
                  },
                }}
              >
                {menu.icon}
                {open && (
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{menu.name}</Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* --- RODAPÉ (Logout) --- */}
        <Box sx={{ mt: 'auto' }}>
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '12px',
              justifyContent: open ? 'flex-start' : 'center',
            }}
          >
            <img src="/images/logout.png" alt="Sair" width="20" />
            {open && <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Sair</Typography>}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default SideBar;
