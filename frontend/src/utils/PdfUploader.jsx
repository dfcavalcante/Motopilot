import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button } from '@mui/material';

const PdfUploader = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        if (onFileSelect) {
          onFileSelect(selectedFile);
        }
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }, 
    maxFiles: 1,
  });

  const handleRemove = (e) => {
    e.stopPropagation(); 
    setFile(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
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
        backgroundColor: isDragActive ? '#d0d0d0' : 'rgba(0, 0, 0, 0.03)',
        transition: 'all .2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
          borderColor: '#666',
        },
        p: 3,
        margin: '0 auto', 
      }}
    >
      <input {...getInputProps()} />

      {file ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
            Pré-visualização:
          </Typography>

          <Box
            sx={{
              width: '200px',
              height: '140px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: 3,
              border: '1px solid #eee'
            }}
          >
          </Box>

          <Typography variant="body2" sx={{ color: '#555' }}>
            {file.name}
          </Typography>

          <Button
            variant="outlined"
            onClick={handleRemove}
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
        // --- ESTADO VAZIO (Cópia exata do design original) ---
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <img
            src="/images/Imagem.png" 
            alt="Upload"
            width={70}
            height={45}
            style={{ opacity: 0.8 }}
          />

          <Typography variant="body1" sx={{ color: '#555', fontSize: '1rem', mt: 1 }}>
            {isDragActive ? 'Solte o PDF aqui' : 'Arraste o PDF aqui'}
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
  );
};

export default PdfUploader;