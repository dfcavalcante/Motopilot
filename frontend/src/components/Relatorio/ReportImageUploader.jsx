import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const ReportImageUploader = ({ onFileSelect, arquivo, error }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!arquivo) {
      setPreview(null);
      return;
    }

    let objectUrl;
    if (arquivo instanceof File) {
      objectUrl = URL.createObjectURL(arquivo);
      setPreview(objectUrl);
    } else if (typeof arquivo === 'string') {
      setPreview(arquivo);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [arquivo]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const removeImage = (e) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '1px solid #FBC8C6',
          borderRadius: '12px',
          height: 200,
          maxHeight: 350,
          width: '100%',
          minWidth: 350,
          maxWidth: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#FFF7F7',
          position: 'relative',
          transition: 'all .2s ease-in-out',
          '&:hover': {
            backgroundColor: '#FFF1F1',
            borderColor: '#F6A9A6',
          },
        }}
      >
        <input {...getInputProps()} />

        {preview ? (
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <IconButton
              onClick={removeImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                zIndex: 2,
                padding: '4px',
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',

                objectFit: 'contain',
                borderRadius: '12px',
                display: 'block',
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              p: 2,
              width: '100%',
            }}
          >
            <img
              src="images/Imagem.png"
              alt="Ícone de Upload"
              style={{ width: 65, height: 40, objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <InsertPhotoIcon sx={{ fontSize: 40, color: '#999', display: 'none' }} />

            <Typography
              variant="body2"
              sx={{ color: error ? '#d32f2f' : '#6A3A3A', fontSize: '0.9rem' }}
            >
              {isDragActive ? 'Solte para adicionar' : 'Arraste imagem aqui'}
            </Typography>

            <Box
              sx={{
                backgroundColor: '#8F0303',
                color: 'white',
                padding: '8px 24px',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 700,
                mt: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                border: '1px solid #FBC8C6',
              }}
            >
              Procurar neste Dispositivo
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportImageUploader;
