import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { getUserInitials, getAvatarColor } from '../../utils/avatarUtils';

const UserRow = ({ usuario, onEdit, onDelete, setAtualizando, atualizando }) => {
  const iniciais = getUserInitials(usuario?.nome, usuario?.email);
  const corAvatar = getAvatarColor(usuario?.nome, usuario?.email);

  const funcao =
    usuario.funcao === 'administrador' || usuario.funcao === 'ADMIN'
      ? 'Administrador'
      : usuario.funcao === 'Tecnico' || usuario.funcao === 'MECANICO'
        ? 'Técnico de Manutenção'
        : usuario.funcao === 'GERENTE'
          ? 'Gerente'
          : usuario.funcao;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '2fr 2.3fr 1.5fr 0.8fr auto',
        columnGap: 1,
        alignItems: 'center',
        width: '100%',
        borderRadius: 4,
        borderBottom: '1px solid #ffffff',
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: 'rgba(0,0,0,0.04)',
          cursor: 'pointer',
        },
        transition: 'background-color 0.2s',
        boxShadow: 1,
        px: { xs: 2, sm: 3 },
        py: 2,
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
          <Typography fontSize={12} color="white">
            {iniciais}
          </Typography>
        </Box>
        <Typography variant="body2" color="black" noWrap fontSize={16}>
          {usuario.nome}
        </Typography>
      </Box>

      {/* COLUNA 2: EMAIL (25%)*/}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
        <Typography variant="body2" color="black" noWrap fontSize={16} textAlign="left">
          {usuario.email}
        </Typography>
      </Box>

      {/*COLUNA 3: FUNÇÃO (15%)*/}
      <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <Typography color="black" noWrap fontSize={16} textAlign="center">
          {funcao}
        </Typography>
      </Box>

      {/*COLUNA 4: STATUS (20%) - Centralizado*/}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#29C406' }} />
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
