import React, { useState } from 'react';
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

const DadosPessoais = ({
  nomeCompleto,
  setNomeCompleto,
  email,
  setEmail,
  numeroMatricula,
  setNumeroMatricula,
  funcao,
  onNext,
}) => {
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !nomeCompleto || !numeroMatricula || !funcao) {
      setError(true);
      return;
    } else {
      setError(false);
    }
  };

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
        {' '}
        Dados Pessoais{' '}
      </Typography>
      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>
        Nome Completo
      </InputLabel>

      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        error={error}
        placeholder={error ? 'Campo Obrigatório *' : ''}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          '& .MuiOutlinedInput-input::placeholder': {
            color: error ? '#FF0000' : 'inherit', //Vermelho que tá no protótipo
            opacity: error ? 0.8 : 0.5, // Garante que o vermelho fique nítido (browsers aplicam transparência por padrão)
            fontSize: 14,
          },
        }}
      />

      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>Email</InputLabel>

      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        placeholder={error ? 'Campo Obrigatório *' : ''}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          '& .MuiOutlinedInput-input::placeholder': {
            color: error ? '#FF0000' : 'inherit', //Vermelho que tá no protótipo
            fontSize: 14,
            opacity: error ? 0.8 : 0.5, // Garante que o vermelho fique nítido (browsers aplicam transparência por padrão)
          },
        }}
      />

      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>
        Número de Matrícula
      </InputLabel>

      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={numeroMatricula}
        error={error}
        onChange={(e) => setNumeroMatricula(e.target.value)}
        placeholder={error ? 'Campo Obrigatório *' : ''}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          '& .MuiOutlinedInput-input::placeholder': {
            color: error ? '#FF0000' : 'inherit', //Vermelho que tá no protótipo
            fontSize: 14,
            opacity: error ? 0.8 : 0.5, // Garante que o vermelho fique nítido (browsers aplicam transparência por padrão)
          },
        }}
      />

      <Box sx={{ width: '100%' }} mb={4}>
        <Typography sx={{ color: 'black', fontSize: 16, mb: 1 }}>Função</Typography>

        <RadioGroup row sx={{ gap: 2 }}>
          {/* Box do Administrador */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              height: 40,
              py: 0.5,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: error ? 'error.main' : '#AEAEAE',
              flex: 1,
              transition: 'border-color 0.2s',
              '&:hover': {
                borderColor: error ? 'error.dark' : 'black',
              },
            }}
          >
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label="Administrador"
              sx={{ width: '100%', margin: 0 }}
            />
          </Box>

          {/* Box do Técnico */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              borderRadius: '8px',
              border: '1px solid',
              height: 40,
              borderColor: error ? 'error.main' : '#AEAEAE',
              flex: 1,
              transition: 'border-color 0.2s',
              '&:hover': {
                borderColor: error ? 'error.dark' : 'black',
              },
            }}
          >
            <FormControlLabel
              value="tecnico"
              control={<Radio />}
              label="Técnico"
              sx={{ width: '100%', margin: 0 }}
            />
          </Box>
        </RadioGroup>

        {/* Mensagem de erro abaixo, se necessário */}
        {error && (
          <FormHelperText error sx={{ ml: 1, mt: 1 }}>
            Campos obrigatórios *
          </FormHelperText>
        )}
      </Box>

      <Box display="flex" gap={2} mt={2} width="100%" justifyContent="flex-end">
        <Button variant="contained" sx={{ backgroundColor: '#DBDBDB', color: 'black' }}>
          Cancelar{' '}
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          sx={{ backgroundColor: '#676767', color: 'white', width: 210, height: 35 }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default DadosPessoais;
