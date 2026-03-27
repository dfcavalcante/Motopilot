import React from 'react';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';
import ImageUploader from './ImageUploader'; 

const DadosGeraisModelo = ({ register, setValue, watch, errors, onNext, onCancel }) => {
  const labelStyle = {
    color: '#000000',
    fontSize: '15px',
    fontWeight: '500',
    marginLeft: '2px',
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFF9F9',
      borderRadius: '12px',
      '& fieldset': { borderColor: '#fd61614f' },
      '&:hover fieldset': { borderColor: '#fd61614f' },
      '&.Mui-focused fieldset': { borderColor: '#fd616146', borderWidth: '1px' },
    },
    '& input': {
      padding: '8.5px 14px',
      fontSize: '0.9rem',
    },
  };

  return (
    <Box sx={{ boxShadow: 3, padding: 4, borderRadius: '16px', backgroundColor: 'white' }}>
      <Typography variant="h5" align="center" sx={{ mb: 2.5, color: '#000000', fontWeight: 400 }}>
        Dados Gerais
      </Typography>

      {/* CONTAINER PRINCIPAL FLEXBOX */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* ================= LADO ESQUERDO: FOTO ================= */}
        <Box sx={{ width: { xs: '100%', md: '40%' }, display: 'flex', flexDirection: 'column' }}>
          <ImageUploader
            arquivo={watch('imagem_moto')}
            onFileSelect={(file) => setValue('imagem_moto', file, { shouldValidate: true })}
          />

          {errors.imagem_moto && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, textAlign: 'center', fontSize: '0.9rem' }}
            >
              {errors.imagem_moto.message}
            </Typography>
          )}
        </Box>

        {/* ================= LADO DIREITO: INPUTS ================= */}
        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* MARCA */}
          <Box sx={{ width: '100%' }}>
            <Stack spacing={1}>
              <Typography sx={labelStyle}>Marca</Typography>
              <TextField
                {...register('marca')}
                fullWidth
                placeholder="Inserir Marca"
                variant="outlined"
                sx={inputSx}
                error={!!errors.marca}
                helperText={errors.marca?.message}
              />
            </Stack>
          </Box>

          {/* MODELO E ANO */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={1}>
                <Typography sx={labelStyle}>Modelo</Typography>
                <TextField
                  {...register('modelo')}
                  fullWidth
                  placeholder="Inserir nome"
                  variant="outlined"
                  sx={inputSx}
                  error={!!errors.modelo}
                  helperText={errors.modelo?.message}
                />
              </Stack>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack spacing={1}>
                <Typography sx={labelStyle}>Ano</Typography>
                <TextField
                  {...register('ano')}
                  fullWidth
                  placeholder="YYYY"
                  variant="outlined"
                  sx={inputSx}
                  error={!!errors.ano}
                  helperText={errors.ano?.message}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ================= RODAPÉ: BOTÕES ================= */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button
          onClick={onCancel}
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
            backgroundColor: '#F30000',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            '&:hover': { backgroundColor: '#F30000' },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default DadosGeraisModelo;
