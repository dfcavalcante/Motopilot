import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { getUserInitials, getAvatarColor } from '../../utils/avatarUtils';

const UserRow = ({ usuario, onEdit, onDelete, setAtualizando, atualizando }) => {
  const iniciais = getUserInitials(usuario?.nome, usuario?.email);
  const corAvatar = getAvatarColor(usuario?.nome, usuario?.email);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '2.2fr 2.2fr 1.5fr 1fr auto',
        columnGap: 2,
        alignItems: 'center',
        width: '100%',
        px: 2,
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: corAvatar,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #eee',
          }}
        >
          <Typography fontSize={12} fontWeight={700} color="white">
            {iniciais}
          </Typography>
        </Box>
        <Typography variant="body2" color="black" noWrap fontSize={16}>
          {usuario.nome}
        </Typography>
      </Box>

      {/* COLUNA 2: EMAIL (25%)*/}
      <Box sx={{ display: 'flex', minWidth: 0 }}>
        <Typography variant="body2" color="black" noWrap fontSize={16} textAlign="left">
          {usuario.email}
        </Typography>
      </Box>

      {/*COLUNA 3: FUNÇÃO (15%)*/}
      <Box sx={{ display: 'flex', minWidth: 0 }}>
        <Typography color="black" noWrap fontSize={16} textAlign="left">
          {usuario.funcao}
        </Typography>
      </Box>

      {/*COLUNA 4: STATUS (20%) - Centralizado*/}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#C5C5C5' }} />
      </Box>

      {/* AÇÕES (10%) - Alinhado à direita */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => {
            setAtualizando(usuario);
          }}
        >
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
