import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import SideBar from './SideBar';
import Header from './Header.jsx';

const BaseFront = ({ nome, icone, height, width, children, headerAction }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
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
              boxShadow: 6,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                mb: 2,
                alignItems: 'center',
                gap: 2,
                width: '100%',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {headerAction && (
                <Box sx={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center' }}>
                  {headerAction}
                </Box>
              )}
              <img src={icone} width={width} height={height} />
              <Typography fontSize={30}> {nome} </Typography>
            </Box>
            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px', mb: 2 }} />
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

export default BaseFront;
