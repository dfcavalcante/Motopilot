import React from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getAvatarColor } from '../../utils/avatarUtils';

const MotoListItem = ({ moto, onClick, onInfoClick }) => {
  const numeroSerie = moto.numeroSerie
  const status = moto.status || moto.estado || 'Manutenção';
  const colaborador = moto.colaborador_nome || '';

  const getStatusStyles = (statusName) => {
    switch (statusName.toLowerCase()) {
      case 'concluída':
      case 'Concluida':
        return {
          color: '#29C406',
          border: '1px solid #29C406',
          backgroundColor: '#E5FFDF',
          fontWeight: 700,
        };
      case 'em manutenção':
      case 'em manutencao':
        return {
          color: '#cec108',
          border: '1px solid #cfc209',
          backgroundColor: '#FFFDDF',
          fontWeight: 700,
        };
      default:
        return {
          color: '#6C757D',
          border: '1px solid #6C757D',
          backgroundColor: '#b2bac1',
          fontWeight: 700,
        };
    }
  };

  const initial = colaborador ? colaborador.charAt(0).toUpperCase() : '';
  

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '12px 24px',
        mb: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        border: '1px solid #F0F0F0',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Coluna 1: Moto / Série */}
      <Box sx={{ flex: 1, justifyContent: 'center', display: 'FLEX' }}>
        <Typography sx={{ color: '#333', fontWeight: 500, justifyContent: 'center', fontSize: 20 }}>
          Nº Série: {numeroSerie}
        </Typography>
      </Box>

      {/* Coluna 2: Status */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
           ...getStatusStyles(status) ,
            padding: '4px 16px',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'capitalize',
          }}
        >
          {status}
        </Box>
      </Box>

      {/* Coluna 3: Colaborador */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {colaborador && (
          <>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: getAvatarColor(initial),
                fontSize: '0.9rem',
                mr: 1.5,
              }}
            >
              {initial}
            </Avatar>
            <Typography sx={{ color: '#555' }}>{colaborador}</Typography>
          </>
        )}
      </Box>

      {/* Ícone da Direita */}
      <Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            if (onInfoClick) onInfoClick(moto);
          }}
          sx={{ border: '1px solid #E0E0E0' }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MotoListItem;
