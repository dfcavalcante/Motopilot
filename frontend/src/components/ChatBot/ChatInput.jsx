import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';

// Componente de entrada de chat, onde escreve pergunta
const ChatInput = ({ input, setInput, onSend }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 720,  flexShrink: 0 }}>
        <TextField
            placeholder="Pergunte alguma coisa..."
            fullWidth
            multiline
            maxRows={6}
            size="small"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    "& fieldset": { borderRadius: "16px" },
                    alignItems: 'flex-end',
                },
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                      <img src="/images/SendButton.png" alt="Send" width="20" style={{ cursor: 'pointer' }} onClick={onSend} />
                    </InputAdornment>
                ),
            }}
        />
    </Box>
  );
};

export default ChatInput;