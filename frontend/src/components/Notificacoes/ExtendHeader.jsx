import { Box, Typography, IconButton } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Header evoluída, tem o perfil, nome e sobrenome do usuário, as notificações
const ExtendHeader = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 70,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          boxSizing: 'border-box',
        }}
      >
        {/* Perfil, nome e sobrenome */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                border: '1px solid black',
                display: 'inline-flex',
                p: 1.5,
                borderRadius: '8px',
              }}
            >
              <img src="/images/person.png" alt="User" width="12" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Nome Sobrenome</Typography>
            </Box>
          </Box>
        </Box>

        {/* Notificações */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            flex: 1,
            height: 54,
          }}
        >
          <Box
            sx={{
              border: '1px solid black',
              display: 'inline-flex',
              borderRadius: '10px',
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton sx={{ color: 'grey.700' }} onClick={() => navigate('/notificacoes')}>
              <img src="/images/bell.png" alt="Notifications" width="16" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flex: 1,
          px: 3,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ExtendHeader;
