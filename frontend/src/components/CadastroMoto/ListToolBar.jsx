import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ListToolbar = ({ input, setInput, anchorEl, onOpenMenu, onCloseMenu, onSelectOrder }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: '100%', mb: 4, px: 2 }}
    >
      {/* Lado Esquerdo: Ordenar */}
      <Box display="flex" alignItems="center" gap={1} sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '14px', color: '#555' }}>Ordenar</Typography>
        <IconButton
          onClick={onOpenMenu}
          size="small"
          sx={{ border: '1px solid #CCC', borderRadius: '4px', padding: '2px' }}
        >
          <KeyboardArrowDownIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onCloseMenu}>
          <MenuItem onClick={() => onSelectOrder('AZ')}>Modelo A - Z</MenuItem>
          <MenuItem onClick={() => onSelectOrder('ZA')}>Modelo Z - A</MenuItem>
        </Menu>
      </Box>

      {/* Centro: Barra de Busca Estilizada */}
      <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Buscar"
          variant="outlined"
          size="small"
          sx={{
            width: '100%',
            maxWidth: '500px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 219, 219, 0.48)',
              boxShadow: '3',
              '& fieldset': { borderColor: 'transparent !important' },
              '&:hover fieldset': { borderColor: 'transparent' },
              '&.Mui-focused fieldset': { borderColor: 'transparent' },
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
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }} />
    </Box>
  );
};

export default ListToolbar;
