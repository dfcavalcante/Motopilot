import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy'; 
import PersonIcon from '@mui/icons-material/Person';  

const ChatMessage = ({ text, isBot }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        mb: 2,
        gap: 1,
        flexDirection: isBot ? 'row' : 'row',
      }}
    >
      <Avatar sx={{ bgcolor: isBot ? 'secondary.main' : 'primary.main' }}>
        {isBot ? <SmartToyIcon /> : <PersonIcon />}
      </Avatar>
      
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: '70%',
          borderRadius: isBot ? '0px 15px 15px 15px' : '15px 0px 15px 15px',
          bgcolor: isBot ? '#f0f0f0' : '#1976d2',
          color: isBot ? 'black' : 'white',
        }}
      >
        <Typography variant="body1">
          {text}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;