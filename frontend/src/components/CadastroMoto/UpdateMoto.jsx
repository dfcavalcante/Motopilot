import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, IconButton, Typography, Box, Stack 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';

const UpdateMoto = ({ open, onClose, onSave, initialData }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    manual: null 
  });

  // Se houver dados iniciais (edição), preenche o formulário ao abrir
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ marca: '', modelo: '', ano: '', manual: null });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, manual: file }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };


  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
          sx: { bgcolor: '#ffffff', color: 'white', borderRadius: 3, border: '1px solid #333' }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #333', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" fontWeight="bold" color='black'>
              {initialData ? "Editar Moto" : "Nova Moto"}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'grey.500', '&:hover': { color: 'black' } }}>
              <CloseIcon />
          </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />

            <TextField
              label="Modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />

            <TextField
              label="Ano"
              name="ano"
              type="number"
              value={formData.ano}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />

            {/* Campo Upload de Manual */}
            <Box sx={{ border: '1px dashed #555', borderRadius: 2, p: 2, textAlign: 'center' }}>
              <Typography variant="caption" display="block" sx={{ color: '#aaa', mb: 1 }}>
                {formData.manual ? `Arquivo: ${formData.manual.name || 'Manual Selecionado'}` : 'Atualizar Manual da Moto (PDF)'}
              </Typography>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ color: '#90caf9', borderColor: '#90caf9', '&:hover': { borderColor: 'white', bgcolor: 'rgba(144, 202, 249, 0.08)' } }}
              >
                Escolher Arquivo
                <input hidden accept="application/pdf" type="file" onChange={handleFileChange} />
              </Button>
            </Box>

          </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #333' }}>
        <Button onClick={onClose} sx={{ color: '#000' }}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          startIcon={<SaveIcon />}
          sx={{ bgcolor: '#90caf9', color: '#000', '&:hover': { bgcolor: '#42a5f5' }, fontWeight: 'bold' }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMoto;