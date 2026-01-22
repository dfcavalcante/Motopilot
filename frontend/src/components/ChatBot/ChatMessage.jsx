import React from 'react';
import { Box, Typography, Paper, Avatar, Tooltip, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Componente de mensagem de chat, exibindo mensagens do bot e do usuário
const ChatMessage = ({ text, isBot }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', 
        alignItems: isBot ? 'flex-start' : 'flex-end',
        mb: 2,
        px: 2, 
      }}
    >
      {/* Balão de Mensagem */}
      <Box
        sx={{
          p: 1.5,
          maxWidth: '75%',
          borderRadius: isBot ? '15px 15px 15px 5px' : '15px 15px 5px 15px',
          bgcolor: isBot ? '#ffffff' : '#B5B5B5',
          color: 'black',
          border: isBot ? '1px solid #e0e0e0' : 'none',
        }}
      >
        <Typography variant="body1">
          {text}
        </Typography>
      </Box>

      {isBot && (
        <Box sx={{ display: 'flex', gap: 0, mt: 0.5, ml: 0.5 }}>
          
          <Tooltip title="Copiar resposta">
            <IconButton size="small" onClick={handleCopy}>
              <ContentCopyIcon fontSize="small" sx={{ color: 'black' }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Gostei">
            <IconButton size="small">
              <ThumbUpAltOutlinedIcon fontSize="small" sx={{ color: 'black' }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Não gostei">
            <IconButton size="small">
              <ThumbDownAltOutlinedIcon fontSize="small" sx={{ color: 'black' }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Mais opções">
            <IconButton size="small">
              <MoreHorizIcon fontSize="small" sx={{ color: 'black' }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}


      {/* Ícone do Cliente (Aparece apenas se NÃO for bot e fica embaixo) */}
      {!isBot && (
        <Box sx={{ mt: 0.5, mr: 1, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              bgcolor: 'grey.400' 
            }}
          >
            <PersonIcon sx={{ fontSize: 16 }} />
          </Avatar>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessage;