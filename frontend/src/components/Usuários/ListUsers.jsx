import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserRow = ({ usuario, onEdit, onDelete, setAtualizando, atualizando }) => {
  return (
    <Box
      sx={{
        display: 'flex', 
        alignItems: 'center', 
        width: '100%', 
        py: 0.5,
        borderBottom: '1px solid #E0E0E0',
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: 'rgba(0,0,0,0.04)',
          cursor: 'pointer',
        },
        transition: 'background-color 0.2s',
      }}
    >
      {/* COLUNA 1: NOME (25%)*/}
      <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #eee',
          }}
        >
          <img src="/images/userIcon.png" alt="User" style={{ width: '14px', height: '18px' }} />
        </Box>
        <Typography variant="body2"  color="black" noWrap fontSize={16}>
          {usuario.nome}
        </Typography>
      </Box>

      {/* COLUNA 2: EMAIL (25%)*/}
      <Box sx={{ width: '25%' }}>
        <Typography variant="body2" color="black" noWrap fontSize={16}>
          {usuario.email}
        </Typography>
      </Box>

      {/*COLUNA 3: FUNÇÃO (15%)*/}
      <Box sx={{ width: '20%' }}>
        <Typography  color="black" noWrap fontSize={16}>
          {usuario.funcao}
        </Typography>
      </Box>

      {/*COLUNA 4: STATUS (20%) - Centralizado*/}
      <Box sx={{ width: '20%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#C5C5C5' }} />
      </Box>

      {/* AÇÕES (10%) - Alinhado à direita */}
      <Box sx={{ width: '5', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <IconButton size="small" onClick={() => { setAtualizando(usuario); }}>
          <img src="/images/lapis.png" alt="Editar" style={{ width: '15px', height: '15px' }} />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(usuario.id)}>
          <img src="/images/lixeira.png" alt="Excluir" style={{ width: '15px', height: '15px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default UserRow;
