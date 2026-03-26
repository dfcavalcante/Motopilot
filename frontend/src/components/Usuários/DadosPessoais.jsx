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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const CustomTextField = ({ label, registerField, error, helperText }) => (
  <Box mb={2} width="100%">
    <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>{label}</InputLabel>
    <TextField
      {...registerField}
      variant="outlined"
      fullWidth
      size="small"
      error={error}
      helperText={null}
      placeholder={error ? helperText : ''}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#FFF9F9',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'error.main' : '#fd61614f',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'error.main' : '#fd61614f',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'error.main' : '#fd616146',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: error ? '#d32f2f' : '#9e9e9e',
          opacity: 1,
        },
      }}
    />
  </Box>
);

const DadosPessoais = ({ register, errors, onNext, loading, control }) => {
  const navigate = useNavigate();

  return (
    <Box
      backgroundColor="white"
      borderRadius="16px"
      p={6}
      mt={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      minWidth={600}
      boxShadow={3}
    >
      <Typography mb={2} fontSize={24}>
        Dados Pessoais
      </Typography>

      <CustomTextField
        label="Nome Completo"
        registerField={register('nomeCompleto')}
        error={!!errors.nomeCompleto}
        helperText={errors.nomeCompleto?.message}
      />

      <CustomTextField
        label="Email"
        registerField={register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <CustomTextField
        label="Número de Matrícula"
        registerField={register('numeroMatricula')}
        error={!!errors.numeroMatricula}
        helperText={errors.numeroMatricula?.message}
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
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: '#fd61614f',
                    backgroundColor: '#FFF9F9',
                    flex: 1,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <FormControlLabel
                    value="Administrador"
                    control={
                      <Radio
                        sx={{
                          display: 'none',
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: field.value === 'Administrador' ? 'none' : '2px solid #999',
                          }}
                        >
                          {field.value === 'Administrador' && (
                            <CheckCircleIcon sx={{ fontSize: 20, color: '#22B14C' }} />
                          )}
                        </Box>
                        Administrador
                      </Box>
                    }
                    sx={{
                      width: '100%',
                      margin: 0,
                    }}
                  />
                </Box>

                {/* Técnico */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    height: 40,
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: '#fd61614f',
                    backgroundColor: '#FFF9F9',
                    flex: 1,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <FormControlLabel
                    value="Tecnico"
                    control={
                      <Radio
                        sx={{
                          display: 'none',
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: field.value === 'Tecnico' ? 'none' : '2px solid #999',
                          }}
                        >
                          {field.value === 'Tecnico' && (
                            <CheckCircleIcon sx={{ fontSize: 20, color: '#22B14C' }} />
                          )}
                        </Box>
                        Tecnico
                      </Box>
                    }
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
            borderColor: '#FFE4E4',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: 18,
            height: 35,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={loading}
          sx={{
            backgroundColor: '#F30000',
            color: 'white',
            width: 210,
            height: 35,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: 18,
          }}
        >
          {loading ? 'Verificando...' : 'Próximo'}
        </Button>
      </Box>
    </Box>
  );
};

export default DadosPessoais;
