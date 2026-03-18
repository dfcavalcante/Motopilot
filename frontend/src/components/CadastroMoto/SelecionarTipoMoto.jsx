import React from 'react';
import { Box, Typography, Radio, RadioGroup } from '@mui/material';

const SelecionarTipoMoto = ({ register, setValue, errors, onNext, watch }) => {
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
        overflow: 'visible',
      }}
    >
      <Typography variant="h5" align="center" sx={{ mb: 4, color: '#000000', fontWeight: 400 }}>
        Selecionar Tipo de Moto
      </Typography>

      <RadioGroup>
        <Radio value={"Moto principal"}> Moto principal </Radio>
        <Radio> Moto secundária </Radio>
      </RadioGroup>
    </Box>
  );
};

export default SelecionarTipoMoto;
