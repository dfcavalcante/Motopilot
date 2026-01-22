import React, { useState } from 'react';
import { Box, Stack, Button, TextField, Divider, Grid, Typography } from '@mui/material';
import HeaderChatBot from '../components/ChatBot/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import PdfUploader from '../components/PdfUploader.jsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { MotoContext, MotoProvider } from '../context/MotoContext.jsx';
import { useContext } from 'react';


const CadastroDeMoto = () => {
	const { cadastrarMoto, loading, erro } = useContext(MotoContext);
  const [arquivoPdf, setArquivoPdf] = useState(null);

  const [formValues, setFormValues] = useState({
    modelo: '',
    ano: '',
    marca: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (arquivo) => {
  if (arquivo && arquivo.target) {
     if (arquivo.target.files && arquivo.target.files[0]) {
        setArquivoPdf(arquivo.target.files[0]);
     }
  } else {
     console.log("Arquivo recebido:", arquivo);
     setArquivoPdf(arquivo);
  }
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
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: "#989898", 
        p: '16px', 
        boxSizing: 'border-box'
      }}
    >
			{/*Sidebar*/}
      <SideBar />

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          ml: '20px', 
          height: '100%'
        }}
      >
        <Stack spacing="8px" sx={{ height: '100%' }}>
				  {/*Header */}
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

					{/*Aqui começa o cadastro de moto */}
					<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <TextField
            label="Modelo"
            name="modelo"
            value={formValues.modelo}
            onChange={handleChange}
            placeholder="Ex: Sport"
            variant="outlined"
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Ano"
              name="ano"
              type="number"
              value={formValues.ano}
              onChange={handleChange}
              placeholder="2024"
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Marca"
              name="marca"
              value={formValues.marca}
              onChange={handleChange}
              placeholder="Honda"
              variant="outlined"
              fullWidth
            />
          </Box>

          <PdfUploader onFileSelect={handleFileSelect} />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<CloudUploadIcon />} 
            sx={{ mt: 2, py: 1.5 }}
          >
            Cadastrar Moto
          </Button>

        </Box>
				</Stack>
			</Box>
		</Box>
  )
}

export default CadastroDeMoto