import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, IconButton, Typography, Box, Stack 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';

const UpdateMoto = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    manual: null 
  });

  // Sincroniza os dados quando o modal abre
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        marca: initialData.marca || '',
        modelo: initialData.modelo || '',
        ano: initialData.ano || '',
        manual: null
      });
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, manual: file }));
  };

  const handleSubmit = () => {
    onSave(formData);
    // O fechamento ocorre após o onSave no componente pai, 
    // mas chamo aqui por segurança caso o pai não feche.
    onClose(); 
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Editar Moto</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Ano"
            name="ano"
            type="number"
            value={formData.ano}
            onChange={handleChange}
            fullWidth
            size="small"
          />

          <Box sx={{ 
            border: '2px dashed #ccc', 
            borderRadius: 2, 
            p: 2, 
            textAlign: 'center',
            bgcolor: '#fafafa'
          }}>
            <Typography variant="caption" display="block" color="textSecondary" sx={{ mb: 1 }}>
              {formData.manual ? `Selecionado: ${formData.manual.name}` : 'Atualizar Manual (PDF)'}
            </Typography>
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              size="small"
            >
              Escolher Arquivo
              <input hidden accept="application/pdf" type="file" onChange={handleFileChange} />
            </Button>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          sx={{ fontWeight: 'bold' }}
        >
          Salvar Alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMoto;