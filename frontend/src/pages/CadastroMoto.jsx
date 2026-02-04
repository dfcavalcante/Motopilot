import React, { useState, useContext } from 'react';
import { Box, Stack, Button, TextField, Typography, Paper, Divider } from '@mui/material';
import HeaderChatBot from '../components/ChatBot/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import PdfUploader from '../components/PdfUploader.jsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { MotoContext } from '../context/MotoContext.jsx';

const CadastroDeMoto = () => {
  const { cadastrarMoto } = useContext(MotoContext);
  const [arquivoPdf, setArquivoPdf] = useState(null);
  const [formValues, setFormValues] = useState({ modelo: '', ano: '', marca: '' });

  const fieldStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (arquivo) => {
    setArquivoPdf(arquivo?.target?.files ? arquivo.target.files[0] : arquivo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.modelo || !arquivoPdf) {
      alert("Por favor, preencha o modelo e anexe o PDF.");
      return;
    }

    const formData = new FormData();
    formData.append('modelo', formValues.modelo);
    formData.append('ano', formValues.ano);
    formData.append('marca', formValues.marca);
    formData.append('documento_pdf', arquivoPdf);

    const sucesso = await cadastrarMoto(formData);
    if (sucesso) {
      alert("Moto cadastrada com sucesso!");
      setFormValues({ modelo: '', ano: '', marca: '' });
      setArquivoPdf(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: "#989898", p: '16px', boxSizing: 'border-box' }}>
      <SideBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}>
        <Stack spacing="8px" sx={{ height: '100%' }}>
          <HeaderChatBot />
          <Paper sx={{ flexGrow: 1, bgcolor: "white", borderRadius: '16px', p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" fontWeight="bold">Novo Cadastro</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Modelo" name="modelo" value={formValues.modelo} onChange={handleChange} sx={fieldStyle} fullWidth />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Ano" name="ano" type="number" value={formValues.ano} onChange={handleChange} sx={fieldStyle} fullWidth />
                <TextField label="Marca" name="marca" value={formValues.marca} onChange={handleChange} sx={fieldStyle} fullWidth />
              </Box>
              <Typography variant="body2" fontWeight="bold">Anexo do Documento (PDF)</Typography>
              <PdfUploader onFileSelect={handleFileSelect} />
              <Button type="submit" variant="contained" startIcon={<CloudUploadIcon />} sx={{ py: 1.5, borderRadius: '8px' }}>
                CADASTRAR MOTO
              </Button>
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}

export default CadastroDeMoto;