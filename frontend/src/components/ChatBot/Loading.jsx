import React from 'react';
import { Box, Typography } from '@mui/material';


const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        mb: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          maxWidth: '75%',
          borderRadius: '15px 15px 15px 5px',
          bgcolor: '#ffffff',
          color: 'black',
          border: '1px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" sx={{ mr: 1 }}>
          Digitando
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              bgcolor: 'grey.500',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.32s',
            }}
          />
          <Box
            sx={{
              width: 4,
              height: 4,
              bgcolor: 'grey.500',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.16s',
            }}
          />
          <Box
            sx={{
              width: 4,
              height: 4,
              bgcolor: 'grey.500',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out both',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Loading;
