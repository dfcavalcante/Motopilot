import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  Avatar,
} from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

// Painel lateral de histórico de conversas agrupado por moto (Geral?)
const HistoricoPanel = ({ chatsPorMoto, loading, onSelectMoto }) => {
  return (
    <Box
      sx={{
        width: 260,
        minWidth: 260,
        height: '100%',
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ml: 2,
        flexShrink: 0,
      }}
    >
      <Typography variant="subtitle1" sx={{ px: 2, pt: 1, pb: 1, fontWeight: 600, flexShrink: 0 }}>
        Histórico
      </Typography>
      <Divider />

      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : chatsPorMoto.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ p: 2, color: 'text.secondary', textAlign: 'center', mt: 2 }}
          >
            Nenhuma conversa anterior.
          </Typography>
        ) : (
          <List disablePadding>
            {chatsPorMoto.map((moto) => {
              // A última pergunta feita (índice 0 pois o backend ordena DESC)
              const preview = moto.chats[0]?.pergunta ?? '';
              const previewTruncado = preview.length > 45 ? preview.slice(0, 45) + '…' : preview;

              return (
                <React.Fragment key={moto.id}>
                  <ListItemButton
                    onClick={() => onSelectMoto(moto, moto.chats)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      alignItems: 'flex-start',
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <Avatar
                      sx={{
                        mr: 1.5,
                        width: 32,
                        height: 32,
                        bgcolor: '#676767',
                        mt: 0.3,
                        flexShrink: 0,
                      }}
                    >
                      <TwoWheelerIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <ListItemText
                      primary={`${moto.marca} ${moto.modelo}`}
                      secondary={previewTruncado || `${moto.chats.length} mensagem(s)`}
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: 11 }}
                    />
                  </ListItemButton>
                  <Divider component="li" />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default HistoricoPanel;
