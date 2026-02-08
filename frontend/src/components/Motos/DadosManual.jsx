import React, { useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PdfUploader from '../PdfUploader.jsx';

const ManualMoto = ({ onBack, onNext }) => {
  const [arquivo, setArquivo] = useState(null);

  const handleFileSelect = (file) => {
    setArquivo(file);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#E0E0E0',
        p: 4,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '800px',
        minHeight: '620px',
        margin: '0 auto',
        fontFamily: 'Roboto, sans-serif',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* --- Cabeçalho (Mantido igual) --- */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            position: 'absolute',
            left: 0,
            top: -5,
            color: '#000000',
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" align="center" sx={{ color: '#333', fontWeight: 500 }}>
          Manual da Moto
        </Typography>
      </Box>

      {/* --- Área Central (Agora usando o PdfUploader) --- */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
        }}
      >
        {/* Container para manter a largura original de 600px */}
        <Box sx={{ width: '600px' }}>
          <PdfUploader onFileSelect={handleFileSelect} />
        </Box>
      </Box>

      {/* --- Rodapé (Mantido igual) --- */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, mr: 10 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            color: '#333',
            borderColor: '#999',
            borderRadius: '8px',
            textTransform: 'none',
            px: 7,
            width: '100px',
            '&:hover': {
              borderColor: '#666',
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={() => onNext(arquivo)}
          disabled={!arquivo}
          sx={{
            backgroundColor: '#888',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            width: '140px',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#666', boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: '#bbb', color: '#eee' },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default ManualMoto;
