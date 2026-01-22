import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

// Componente de entrada de chat, onde escreve pergunta
const ChatInput = ({ input, setInput, onSend }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 720, mt: 2, flexShrink: 0 }}>
        <TextField
            placeholder="Pergunte alguma coisa..."
            fullWidth
            multiline
            maxRows={6}
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderRadius: "10px" },
                    alignItems: 'flex-end'
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AddIcon sx={{ color: 'black', cursor:'pointer' }} />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                      <ArrowCircleUpIcon sx={{ color: 'black', cursor: 'pointer' }} onClick={onSend} />
                    </InputAdornment>
                ),
            }}
        />
    </Box>
  );
};

export default ChatInput;