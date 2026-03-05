import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import BarraPesquisa from '../CadastroMoto/BarraPesquisa';

{  /* Componente de toolbar para a página de usuários, contendo os controles de visualização, ordenação e barra de pesquisa */}

export const Toolbar = ({
  viewMode,
  setViewMode,
  handleClickOrdernar,
  anchorEl,
  openMenu,
  handleCloseMenu,
  handleSelectOrder,
  input,
  setInput,
}) => (
  <Box display="flex" alignItems="center" mt={1} sx={{ width: '100%', px: 2 }}>
    <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
      <Box display="flex" alignItems="center" gap={1} ml={9}>
        <Typography sx={{ fontWeight: '500', whiteSpace: 'nowrap' }}>Visualização</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => setViewMode('grid')}
            sx={{ border: viewMode === 'grid' ? '1px solid #666' : '1px solid #E0E0E0', borderRadius: '4px', width: '24px', height: '24px' }}
          >
            <img src="/images/Organizar1.png" alt="Grid" height={14} />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            sx={{ border: viewMode === 'list' ? '1px solid #666' : '1px solid #a5a5a5', borderRadius: '4px', width: '24px', height: '24px' }}
          >
            <img src="/images/Organizar2.png" alt="List" height={14} />
          </IconButton>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Typography sx={{ fontWeight: '500', color: 'grey.900' }}>Ordenar</Typography>
        <IconButton onClick={handleClickOrdernar} sx={{ width: 20, height: 20, borderRadius: '4px', border: '1px solid #E0E0E0', backgroundColor: 'white' }}>
          <img src="/images/linhaPraBaixo.png" alt="Ordenar" style={{ width: '10px' }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
          <MenuItem onClick={() => handleSelectOrder('AZ')}>Ordenar A - Z</MenuItem>
          <MenuItem onClick={() => handleSelectOrder('ZA')}>Ordenar Z - A</MenuItem>
        </Menu>
      </Box>
    </Box>

    <Box sx={{ width: '580px' }}>
      <BarraPesquisa input={input} setInput={setInput} />
    </Box>
    <Box sx={{ flex: 1 }} />
  </Box>
);