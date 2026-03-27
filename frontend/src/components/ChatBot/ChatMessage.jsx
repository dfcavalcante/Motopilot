import React from 'react';
import { Box, Typography, Avatar, Tooltip, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { getAvatarColor, getUserInitials } from '../../utils/avatarUtils';

// Componente de mensagem de chat, exibindo mensagens do bot e do usuário
const ChatMessage = ({ text, isBot, userNome = '', userEmail = '' }) => {
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
        '&:first-of-type': {
          mt: 2,
        },
      }}
    >
      {/* Balão de Mensagem */}
      <Box
        sx={{
          p: 1.5,
          maxWidth: '75%',
          borderRadius: isBot ? '15px 15px 15px 5px' : '15px 15px 5px 15px',
          bgcolor: isBot ? '#ffffff' : 'rgba(255, 219, 219, 0.18)',
          color: 'black',
          border: isBot ? '1px solid #ffffff' : 'none',
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{
            wordBreak: 'break-word',
            '& p': { mt: 0, mb: 1 },
            '& p:last-child': { mb: 0 },
            '& ul, & ol': { mt: 0, mb: 1, pl: 3 },
            '& li': { mb: 0.5 },
            '& strong': { fontWeight: 'bold' },
          }}
        >
          {isBot ? <ReactMarkdown>{text}</ReactMarkdown> : text}
        </Typography>
      </Box>

      {isBot && (
        <Box sx={{ display: 'flex', gap: 0, mt: 0.5, ml: 0.8 }}>
          <Tooltip title="Copiar resposta">
            <IconButton size="small" onClick={handleCopy}>
              <img src="/images/copy.png" alt="Logo" width="15" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Mais opções">
            <IconButton size="small">
              <img src="images/Refresh.svg" alt="Logo" width="15" />
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
              fontSize: 11,
              fontWeight: 700,
              bgcolor: getAvatarColor(userNome, userEmail),
              color: '#fff',
            }}
          >
            {getUserInitials(userNome, userEmail)}
          </Avatar>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessage;
