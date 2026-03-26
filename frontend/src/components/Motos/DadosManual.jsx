import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PdfUploader from '../../utils/PdfUploader.jsx';

const ManualMoto = ({ onBack, setValue, watch, loading, onNext }) => {
  const arquivoAtual = watch('manual_pdf_path');

  const handleFileSelect = (file) => {
    setValue('manual_pdf_path', file, { shouldValidate: true });
  };

  return (
    <>
      {/* --- Cabeçalho --- */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            position: 'absolute',
            left: 0,
            top: -5,
            color: '#000000',
            borderRadius: 2,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" align="center" sx={{ color: '#333', fontWeight: 500 }}>
          Manual da Moto
        </Typography>
      </Box>

      {/* --- Área Central (PdfUploader) --- */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
        }}
      >
        <Box sx={{ width: '600px' }}>
          <PdfUploader onFileSelect={handleFileSelect} arquivoAtual={arquivoAtual} />
        </Box>
      </Box>

      {/* --- Rodapé --- */}
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
          Voltar
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={onNext}
          disabled={!arquivoAtual || loading}
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
          {loading ? 'Salvando...' : 'Finalizar'}
        </Button>
      </Box>
    </>
  );
};

export default ManualMoto;
