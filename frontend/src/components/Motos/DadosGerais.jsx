import React, { useEffect } from 'react';
import { Box, Typography, TextField, Grid, Button, Stack } from '@mui/material';
import ImageUploader from '../Motos/ImageUploader.jsx';

const DadosGerais = ({
  dados,
  handleChange,
  onNext,
  errors,
  motos,
  setErrors,
  verificarNumeroSerie,
}) => {
  useEffect(() => {
    const checkSerie = async () => {
      if (!dados.numeroSerie || !setErrors) return;
      let message = null;
      const localDup = motos.some((moto) => moto.numero_serie === dados.numeroSerie);
      if (localDup) {
        message = `O número de série '${dados.numeroSerie}' já está registrado no sistema.`;
      } else if (verificarNumeroSerie) {
        const exists = await verificarNumeroSerie(dados.numeroSerie);
        if (exists) {
          message = `O número de série '${dados.numeroSerie}' já está registrado no sistema.`;
        }
      }
      if (message) {
        setErrors((prev) => ({
          ...prev,
          numeroSerie: message,
        }));
      } else {
        setErrors((prev) => {
          const newErr = { ...prev };
          delete newErr.numeroSerie;
          return newErr;
        });
      }
    };
    checkSerie();
  }, [dados.numeroSerie, motos, setErrors, verificarNumeroSerie]);
  

  const labelStyle = {
    color: '#000000',
    fontSize: '15px',
    fontWeight: '500',
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
        pl: 16,
        pr: 16,
        pt: 4,
        pb: 4,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        fontFamily: 'Roboto, sans-serif',
        minHeight: '600px',
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
        <Stack spacing={1} sx={{ height: '100%', width: '25%', ml: 5 }}>
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
        </Stack>

        <Stack spacing={1} sx={{ height: '100%', width: '25%', ml: 5 }}>
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
        </Stack>
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
