import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  TextField,
  FormControlLabel,
  Button,
  Radio,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const DadosPessoais = ({ register, errors, onNext, loading, control }) => {
  const navigate = useNavigate();

  return (
    <Box
      backgroundColor="#DBDBDB"
      borderRadius="16px"
      p={6}
      mt={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      minWidth={600}
    >
      <Typography mb={2} fontSize={24}>
        Dados Pessoais
      </Typography>

      {/* CAMPO NOME */}
      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>
        Nome Completo
      </InputLabel>
      <TextField
        {...register('nomeCompleto')}
        variant="outlined"
        fullWidth
        size="small"
        error={!!errors.nomeCompleto}
        helperText={errors.nomeCompleto?.message}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
        }}
      />

      {/* CAMPO EMAIL */}
      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>Email</InputLabel>
      <TextField
        {...register('email')}
        variant="outlined"
        fullWidth
        size="small"
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
        }}
      />

      {/* CAMPO MATRICULA */}
      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>
        Número de Matrícula
      </InputLabel>
      <TextField
        {...register('numeroMatricula')}
        variant="outlined"
        fullWidth
        size="small"
        error={!!errors.numeroMatricula}
        helperText={errors.numeroMatricula?.message}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
        }}
      />

      {/* RADIOS (FUNÇÃO) */}
      <Box sx={{ width: '100%' }} mb={4}>
        <Typography sx={{ color: 'black', fontSize: 16, mb: 1 }}>Função</Typography>

        <Controller
          name="funcao"
          control={control}
          rules={{ required: 'Selecione uma função' }}
          render={({ field }) => (
            <>
              <RadioGroup
                row
                sx={{ gap: 2 }}
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              >
                {/* Admin */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    height: 40,
                    py: 0.5,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: errors.funcao ? 'error.main' : '#AEAEAE',
                    flex: 1,
                  }}
                >
                  <FormControlLabel
                    value="Administrador"
                    control={<Radio />}
                    label="Administrador"
                    sx={{ width: '100%', margin: 0 }}
                  />
                </Box>

                {/* Técnico */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 0.5,
                    borderRadius: '8px',
                    border: '1px solid',
                    height: 40,
                    borderColor: errors.funcao ? 'error.main' : '#AEAEAE',
                    flex: 1,
                  }}
                >
                  <FormControlLabel
                    value="Tecnico"
                    control={<Radio />}
                    label="Tecnico"
                    sx={{ width: '100%', margin: 0 }}
                  />
                </Box>
              </RadioGroup>

              {errors.funcao && (
                <FormHelperText error sx={{ ml: 1, mt: 1, fontSize: 14 }}>
                  {errors.funcao.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </Box>

      {/* BOTÕES */}
      <Box display="flex" gap={2} mt={2} width="100%" justifyContent="flex-end">
        <Button
          onClick={() => navigate('/usuarios')}
          variant="outlined"
          disabled={loading}
          sx={{
            color: '#333',
            borderColor: '#999',
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onNext} // Dispara a função que está no Hook (que valida e avança)
          disabled={loading}
          sx={{
            backgroundColor: '#676767',
            color: 'white',
            width: 210,
            height: 35,
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          {loading ? 'Verificando...' : 'Próximo'}
        </Button>
      </Box>
    </Box>
  );
};

export default DadosPessoais;
