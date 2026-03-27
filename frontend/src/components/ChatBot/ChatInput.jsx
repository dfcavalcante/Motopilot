import React from 'react';
import { Box, TextField, InputAdornment, Avatar, IconButton } from '@mui/material';
import { useLogin } from '../../context/LoginContext.jsx';
import { getAvatarColor, getUserInitials } from '../../utils/avatarUtils';

// Componente de entrada de chat, onde escreve pergunta
const ChatInput = ({ input, setInput, onSend, disabled = false }) => {
  const { user } = useLogin();
  const nomeUsuario = user?.nome || '';
  const emailUsuario = user?.email || '';

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 720, flexShrink: 0 }}>
      <TextField
        placeholder="Pergunte alguma coisa..."
        fullWidth
        multiline
        maxRows={6}
        size="small"
        variant="outlined"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            '& fieldset': {
              borderRadius: '16px',
              borderColor: 'transparent !important',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent',
            },
            alignItems: 'flex-end',
            backgroundColor: 'rgba(255, 219, 219, 0.48)',
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#6a6a6a',
            opacity: 1,
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  if (!disabled) onSend();
                }}
              >
                <img
                  src="/images/SendButton.png"
                  alt="Send"
                  width="20"
                  style={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: 1,
                  }}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ChatInput;
