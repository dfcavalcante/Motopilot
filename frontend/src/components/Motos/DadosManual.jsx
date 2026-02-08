import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ManualMoto = ({ onBack, onNext }) => {
  const [arquivo, setArquivo] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setArquivo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
  });

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

      {/* --- Área Central (Dropzone) --- */}
      <Box
        sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}
      >
        <Box
          {...getRootProps()}
          sx={{
            border: '1px solid #A0A0A0',
            borderRadius: '16px',
            width: '600px',
            height: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#d0d0d0' : 'rgba(0, 0, 0, 0.03)', // Fundo sutil
            transition: 'all .2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
              borderColor: '#666',
            },
            p: 3,
          }}
        >
          <input {...getInputProps()} />

          {arquivo ? (
            // Estado com arquivo selecionado (Mostrando a Foto)
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                Pré-visualização:
              </Typography>

              {/* Renderização da Imagem */}
              <Box
                component="img"
                sx={{
                  width: '100%',
                  maxWidth: '200px',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: 3,
                }}
                alt="Preview da imagem"
                src={URL.createObjectURL(arquivo)}
              />

              <Typography variant="body2" sx={{ color: '#555' }}>
                {arquivo.name}
              </Typography>

              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  setArquivo(null);
                }}
                sx={{
                  mt: 1,
                  borderRadius: '20px',
                  borderColor: '#666',
                  color: '#666',
                  '&:hover': { borderColor: '#646464', color: '#303030' },
                }}
              >
                Remover Arquivo
              </Button>
            </Box>
          ) : (
            // Estado Inicial
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <img
                src="/images/Imagem.png"
                alt="Upload"
                width={70}
                height={45}
                style={{ opacity: 0.8 }}
              />

              <Typography variant="body1" sx={{ color: '#555', fontSize: '1rem', mt: 1 }}>
                {isDragActive ? 'Solte o arquivo aqui' : 'Arraste arquivo aqui'}
              </Typography>

              <Box
                sx={{
                  backgroundColor: '#666',
                  color: 'white',
                  padding: '10px 30px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  mt: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Procurar neste Dispositivo
              </Box>
            </Box>
          )}
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
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
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
