import React from 'react';
import { Box, Typography, TextField, Grid, Button } from '@mui/material';
import ImageUploader from '../Motos/ImageUploader.jsx';

const DadosGerais = ({ dados, handleChange, onNext, errors }) => {
  const labelStyle = {
    color: '#000000',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '4px',
    marginLeft: '2px',
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: '12px',
      '& fieldset': { borderColor: '#A0A0A0' },
      '&:hover fieldset': { borderColor: '#666' },
      '&.Mui-focused fieldset': { borderColor: '#666', borderWidth: '1px' },
    },
    '& input': {
      padding: '10px 14px',
      fontSize: '0.9rem',
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: '#E0E0E0',
        p: 8,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        fontFamily: 'Roboto, sans-serif',
        minHeight: '500px',
      }}
    >
      <Typography variant="h5" align="center" sx={{ mb: 4, color: '#000000', fontWeight: 400 }}>
        Dados Gerais
      </Typography>

      <Grid container spacing={4}>
        {/* LADO ESQUERDO: FOTO */}
        <Grid item xs={12} md={5}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ImageUploader
              onFileSelect={(file) => handleChange({ target: { name: 'foto', files: [file] } })}
              arquivo={dados.foto}
            />

            {errors.foto && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, textAlign: 'center', fontSize: '0.9rem' }}
              >
                {errors.foto}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* LADO DIREITO: INPUTS */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* === LINHA 1 === */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Modelo</Typography>
                <TextField
                  name="modelo"
                  value={dados.modelo}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Inserir nome"
                  variant="outlined"
                  sx={inputSx}
                  error={!!errors.modelo}
                  helperText={errors.modelo}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Número de Série</Typography>
                <TextField
                  name="numeroSerie"
                  value={dados.numeroSerie}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Inserir número de série"
                  variant="outlined"
                  sx={inputSx}
                  error={!!errors.numeroSerie}
                  helperText={errors.numeroSerie}
                />
              </Box>
            </Box>

            {/* === LINHA 2 === */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Marca</Typography>
                <TextField
                  name="marca"
                  value={dados.marca}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Inserir Setor"
                  variant="outlined"
                  sx={inputSx}
                  error={!!errors.marca}
                  helperText={errors.marca}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Ano</Typography>
                <TextField
                  name="ano"
                  value={dados.ano}
                  onChange={handleChange}
                  fullWidth
                  placeholder="DD/MM/AA"
                  variant="outlined"
                  sx={inputSx}
                  error={!!errors.ano}
                  helperText={errors.ano}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* PARTE INFERIOR: DESCRIÇÃO */}
      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography sx={{ fontSize: 15, mb: 0.5, ml: 0.5 }}>Descrição da Moto</Typography>
        <TextField
          fullWidth
          name="descricao"
          value={dados.descricao}
          onChange={handleChange}
          multiline
          rows={5}
          placeholder="Descreva detalhes adicionais sobre a moto, como estado de conservação, histórico de manutenção, etc."
          sx={{
            ...inputSx,
            '& .MuiOutlinedInput-root': {
              ...inputSx['& .MuiOutlinedInput-root'],
              borderRadius: '16px',
              alignItems: 'flex-start',
            },
          }}
          error={!!errors.descricao}
          helperText={errors.descricao}
        />
      </Box>

      {/* RODAPÉ: BOTÕES */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
        <Button
          variant="outlined"
          sx={{
            color: '#333',
            borderColor: '#999',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onNext}
          variant="contained"
          sx={{
            backgroundColor: '#666',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            '&:hover': { backgroundColor: '#444' },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default DadosGerais;
