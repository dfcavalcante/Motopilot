import React from 'react';
import { Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import BarraPesquisa from '../CadastroMoto/BarraPesquisa';

const ListagemMotosModeloControls = ({
  input,
  setInput,
  anchorEl,
  openMenu,
  handleClickOrdernar,
  handleCloseMenu,
  handleSelectOrder,
}) => {
  return (
    <Box display="flex" alignItems="center" mt={1} sx={{ width: '100%', px: 2 }}>
      <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center" gap={1} ml={9}>
          <Typography sx={{ fontWeight: '500', color: 'grey.900' }}>Ordenar</Typography>
          <IconButton
            onClick={handleClickOrdernar}
            sx={{
              width: 20,
              height: 20,
              borderRadius: '4px',
              border: '1px solid #E0E0E0',
              backgroundColor: 'white',
            }}
          >
            <img src="/images/linhaPraBaixo.png" alt="Ordenar" style={{ width: '10px' }} />
          </IconButton>

          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
            <MenuItem onClick={() => handleSelectOrder('AZ')}>Modelo A - Z</MenuItem>
            <MenuItem onClick={() => handleSelectOrder('ZA')}>Modelo Z - A</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box sx={{ width: '580px' }}>
        <BarraPesquisa input={input} setInput={setInput} />
      </Box>

      <Box sx={{ flex: 1 }} />
    </Box>
  );
};

export default ListagemMotosModeloControls;
