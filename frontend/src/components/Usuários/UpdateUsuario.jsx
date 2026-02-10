import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, IconButton, Typography, Box, Stack, 
  RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';

const UpdateUsuario = ({ open, onClose, onSave, initialData }) => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    funcao: '',
    senha: '', //n sei se é pra realmente isso ter aq
    status: '',
  });

  // Se houver dados iniciais (edição), preenche o formulário ao abrir
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        email: initialData.email || '',
        funcao: initialData.funcao || '',
        senha: initialData.senha || '',
        status: initialData.status || '',
      });
    } else {
      setFormData({ nome: '', email: '', funcao: '', senha: '', status:'' });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          sx: { bgcolor: '#ffffff', color: 'black', borderRadius: 3, border: '1px solid #333' }
        }}
    >
        <DialogTitle sx={{ borderBottom: '1px solid #333', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6"  color='black' justifyContent={'flex-start'}>
            Editar usuário
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'grey.500', '&:hover': { color: 'black' } }}>
              <CloseIcon />
          </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              sx={{'& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#e0e0e0' },
                  },}}
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              sx={{'& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#e0e0e0' },
                  },}}
            />

            <RadioGroup
              row
              name="funcao"
              value={formData.funcao}
              onChange={(e) => setFormData(prev => ({ ...prev, funcao: e.target.value }))}
              sx={{ gap: 4 }}
              fullWidth
            >
              {/* Admin */}
              <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: 40,
                borderRadius: '8px',
                border: '1px solid',
                width: '180px'
                        }}
                      >
                        <FormControlLabel
                          value="Administrador"
                          control={<Radio />}
                          label="Administrador"
                          sx={{  margin: 0 }}
                        />
                      </Box>
            
                      {/* Técnico */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '8px',
                          border: '1px solid',
                          height: 40,
                          width: '180px'
                        }}
                      >
                        <FormControlLabel
                          value="Tecnico"
                          control={<Radio />}
                          label="Técnico"
                          sx={{ margin: 0 }}
                        />
                      </Box>
                    </RadioGroup>

            <TextField
              label="Senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              fullWidth
              variant='outlined'
              size="small"
              sx={{'& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#fff',
                '& fieldset': { borderColor: '#e0e0e0' },
              },}}
              />


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

export default UpdateUsuario;