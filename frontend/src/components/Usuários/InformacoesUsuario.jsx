import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { getUserInitials, getAvatarColor } from '../../utils/avatarUtils';

const InformacoesUsuario = ({ usuario, onEdit, onDelete, atualizando, setAtualizando }) => {
  const iniciais = getUserInitials(usuario?.nome, usuario?.email);
  const corAvatar = getAvatarColor(usuario?.nome, usuario?.email);

  return (
    <Box
      backgroundColor="#B2B2B2"
      width="100%"
      maxWidth={600}
      height={130}
      borderRadius="18px"
      p={2}
      display="flex"
      alignItems="center"
      gap={2}
    >
      {/* Ícone à esquerda */}
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: corAvatar,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0, // <-- Evita que o ícone esprema se o nome for grande
        }}
      >
        <Typography fontSize={16} fontWeight={700} color="white">
          {iniciais}
        </Typography>
      </Box>

      {/* Conteúdo à direita */}
      <Box flex={1} overflow="hidden">
        {' '}
        {/* Nome do usuário*/}
        <Typography fontSize={22} fontWeight={300} noWrap>
          {usuario.nome}
        </Typography>
        {/* Cargo do usuário */}
        <Typography fontSize={16} fontWeight={600} noWrap>
          {usuario.funcao}
        </Typography>
        {/* Email + ícones alinhados */}
        <Box display="flex" alignItems="center" justifyContent="space-between" marginTop={1}>
          <Typography fontSize={13} fontWeight={300} noWrap sx={{ mr: 1 }}>
            {usuario.email}
          </Typography>

          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              onClick={() => {
                setAtualizando(usuario.id, atualizando);
              }}
            >
              <img src="/images/lapis.png" alt="Editar" style={{ width: '14px', height: '14px' }} />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(usuario.id)}>
              <img
                src="/images/lixeira.png"
                alt="Excluir"
                style={{ width: '14px', height: '14px' }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InformacoesUsuario;
