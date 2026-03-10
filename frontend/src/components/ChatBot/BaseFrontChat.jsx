import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import SideBar from '../../utils/SideBar';
import Header from '../../utils/Header.jsx';

/*BaseFront só que tudo centralizado por causa da página do chatbot ser assim etc*/
const BaseFrontChat = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#989898',
        p: '16px',
        boxSizing: 'border-box',
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      <SideBar />

      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}
      >
        <Stack spacing="8px" sx={{ height: '100%' }}>
          <Box sx={{ flexShrink: 0 }}>
            <Header />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: 'white',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {children}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default BaseFrontChat;
