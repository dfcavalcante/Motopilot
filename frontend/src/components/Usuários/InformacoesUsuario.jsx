import React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';

const InformacoesUsuario = ({ nome, cargo, email }) => {
  return (
    <Box
      backgroundColor="#B2B2B2"
      width={410}
      height={130}
      borderRadius="18px"
      p={2}
      mt={2}
      display="flex"
      alignItems="center"
      gap={3}
    >
      {/* Ícone à esquerda */}
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="/images/userIcon.png"
          alt="Ícone Usuário"
          style={{ width: '16px', height: '20px' }}
        />
      </Box>

      {/* Conteúdo à direita */}
      <Box flex={1}>
        <Typography fontSize={24} fontWeight={300}>
          {nome}
        </Typography>
        <Typography fontSize={20} mb={1} fontWeight={400}>
          {cargo}
        </Typography>

        {/* Email + ícones alinhados */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize={16} fontWeight={300}>
            {email}
          </Typography>

          <Box display="flex" gap={1}>
            <IconButton size="small" onClick={() => onEdit(usuario)}>
          <img src="/images/lapis.png" alt="Editar" style={{ width: '14px', height: '14px' }} />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(usuario.id)}>
          <img src="/images/lixeira.png" alt="Excluir" style={{ width: '14px', height: '14px' }} />
        </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InformacoesUsuario;
