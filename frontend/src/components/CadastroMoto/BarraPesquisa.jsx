import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';

const BarraPesquisa = ({ input, setInput, onSend }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 578, mt: 1 }}>
      <TextField
        placeholder="Buscar"
        variant="outlined"
        value={input}
        fullWidth
        size="small"
        onChange={(e) => setInput(e.target.value)}
        sx={{
          height: '36px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            boxShadow: '3',
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
            backgroundColor: 'rgba(255, 219, 219, 0.48)',
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#6a6a6a',
            opacity: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/images/search.png" alt="Search" width="12" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <img
                src="/images/SendButton.png"
                alt="Send"
                width="12"
                style={{ cursor: 'pointer' }}
                onClick={onSend}
              />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default BarraPesquisa;
