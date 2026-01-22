import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';

// Recebe a prop onFileSelect
const PdfUploader = ({ onFileSelect }) => {

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      // Envia o arquivo de volta para o pai (CadastroMoto)
      onFileSelect(file); 
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1, // Limitado a 1 arquivo para cadastro
  });

  // Estilização condicional baseada no Drag
  const activeStyle = {
    borderColor: '#2196f3',
    backgroundColor: '#e3f2fd'
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Anexo do Documento (PDF)
      </Typography>
      
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#fafafa',
          transition: 'border .2s ease-in-out',
          ...(isDragActive ? activeStyle : {}),
          '&:hover': { borderColor: '#999' }
        }}
      >
        <input {...getInputProps()} />
        
        {acceptedFiles.length > 0 ? (
          <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
             📄 {acceptedFiles[0].name}
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            {isDragActive 
              ? "Solte o PDF aqui..." 
              : "Arraste o PDF ou clique para selecionar"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PdfUploader;