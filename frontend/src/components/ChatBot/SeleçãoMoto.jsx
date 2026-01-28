import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CircularProgress, IconButton, Box, Typography } from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import CloseIcon from '@mui/icons-material/Close';

//Pop-up da seleção de motos
const MotoSelectionDialog = ({ open, onClose, onSelect, motos, loading }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
          sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: 3, border: '1px solid #333', position: 'relative' }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', borderBottom: '1px solid #333', pb: 2, pr: 5 }}>
          <Typography variant="body2" fontWeight="bold">
              {loading ? "Carregando..." : "Escolha sua Moto"}
          </Typography>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500', '&:hover': { color: 'white', bgcolor: '#333' } }}>
              <CloseIcon />
          </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, p: 0 }}>
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#90caf9' }} /></Box>
          ) : (
              <List sx={{ p: 2 }}>
                  {motos.map((moto) => (
                      <ListItem key={moto.id} disablePadding sx={{ mb: 1 }}>
                          <ListItemButton 
                              onClick={() => onSelect(moto)} 
                              sx={{ borderRadius: 2, bgcolor: '#252525', border: '1px solid transparent', '&:hover': { bgcolor: '#333', borderColor: '#90caf9' } }}
                          >
                              <ListItemIcon><TwoWheelerIcon sx={{ color: '#90caf9' }} /></ListItemIcon>
                              <ListItemText 
                                  primary={moto.modelo} 
                                  secondary={`${moto.marca} • ${moto.ano}`}
                                  primaryTypographyProps={{ color: 'white' }}
                                  secondaryTypographyProps={{ color: '#aaa' }}
                              />
                          </ListItemButton>
                      </ListItem>
                  ))}
              </List>
          )}
      </DialogContent>
    </Dialog>
  );
};

export default MotoSelectionDialog;