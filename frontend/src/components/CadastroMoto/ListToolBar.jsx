import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, TextField, InputAdornment } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ListToolbar = ({ input, setInput, anchorEl, onOpenMenu, onCloseMenu, onSelectOrder }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ width: '100%', mb: 4, px: 2 }}>
      
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
              borderRadius: '24px',
              backgroundColor: '#FAFAFA',
              '& fieldset': { borderColor: '#E0E0E0' },
              '&:hover fieldset': { borderColor: '#BDBDBD' },
              '&.Mui-focused fieldset': { borderColor: '#999' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#888' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    backgroundColor: '#000',
                    color: '#FFF',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                </Box>
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