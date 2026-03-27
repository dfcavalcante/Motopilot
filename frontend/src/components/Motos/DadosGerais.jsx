import React from 'react';
import { Box, Typography, TextField, Grid, Button, Stack } from '@mui/material';
import ImageUploader from '../Motos/ImageUploader.jsx';

const DadosGerais = ({
  register,
  setValue,
  errors,
  watch,
  modeloPaiSelecionado,
  onNext,
  onBack,
}) => {
  const labelStyle = {
    color: '#000000',
    fontSize: '15px',
    fontWeight: '500',
    marginLeft: '2px',
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      '& fieldset': {
        borderColor: '#fd61614f',
      },
      '&:hover fieldset': {
        borderColor: '#fd61614f',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fd61614f',
        borderWidth: '1px',
      },
      '&.Mui-disabled fieldset': {
        borderColor: '#fd61614f',
      },
      '&.Mui-error fieldset': {
        borderColor: '#fd61614f',
      },
    },

    '& input': {
      padding: '10px 14px',
      fontSize: '0.9rem',
    },
  };

  return (
    <Box
      sx={{
        boxShadow: 3,
        pl: 16,
        pr: 16,
        pt: 4,
        pb: 4,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        fontFamily: 'Roboto, sans-serif',
        overflow: 'visible',
      }}
    >
      <Typography variant="h5" align="center" sx={{ mb: 4, color: '#000000', fontWeight: 400 }}>
        Dados Gerais
      </Typography>

      <Grid container spacing={4}>
        {/* LADO ESQUERDO: FOTO */}
        <Grid>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ImageUploader
              arquivo={watch('foto')}
              onFileSelect={(file) => setValue('foto', file, { shouldValidate: true })}
              readOnly={Boolean(modeloPaiSelecionado?.id)}
            />

            {errors.foto && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, textAlign: 'center', fontSize: '0.9rem' }}
              >
                {errors.foto.message}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* LADO DIREITO: INPUTS */}
        <Stack spacing={1} sx={{ height: '100%', width: '25%', ml: 5 }}>
          <Typography sx={labelStyle}>Modelo</Typography>
          <TextField
            {...register('modelo')}
            fullWidth
            placeholder="Inserir nome"
            variant="outlined"
            sx={inputSx}
            error={!!errors.modelo}
            helperText={errors.modelo?.message}
            disabled={Boolean(modeloPaiSelecionado?.id)}
          />

          <Typography sx={labelStyle}>Número de Série</Typography>
          <TextField
            {...register('numeroSerie')}
            fullWidth
            placeholder="Inserir número de série"
            variant="outlined"
            sx={inputSx}
            error={!!errors.numeroSerie}
            helperText={errors.numeroSerie?.message}
          />
        </Stack>

        <Stack spacing={1} sx={{ height: '100%', width: '25%', ml: 5 }}>
          <Typography sx={labelStyle}>Marca</Typography>
          <TextField
            {...register('marca')}
            fullWidth
            placeholder="Inserir Marca"
            variant="outlined"
            sx={inputSx}
            error={!!errors.marca}
            helperText={errors.marca?.message}
            disabled={Boolean(modeloPaiSelecionado?.id)}
          />

          <Typography sx={labelStyle}>Ano</Typography>
          <TextField
            {...register('ano')}
            fullWidth
            placeholder="YYYY"
            variant="outlined"
            sx={inputSx}
            error={!!errors.ano}
            helperText={errors.ano?.message}
            disabled={Boolean(modeloPaiSelecionado?.id)}
          />
        </Stack>
      </Grid>

      {/* PARTE INFERIOR: DESCRIÇÃO */}
      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography sx={{ fontSize: 15, mb: 0.5, ml: 0.5 }}>Descrição da Moto</Typography>
        <TextField
          {...register('descricao')}
          fullWidth
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
          helperText={errors.descricao?.message}
        />
      </Box>

      {/* RODAPÉ: BOTÕES */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
        <Button
          onClick={onBack}
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
          type="submit"
          variant="contained"
          onClick={onNext}
          sx={{
            backgroundColor: '#F30000',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            width: '180px',
            '&:hover': { backgroundColor: '#F30000' },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default DadosGerais;
