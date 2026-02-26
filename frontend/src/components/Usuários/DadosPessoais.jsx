import React, { useState, useContext } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { UsersContext } from '../../context/UserContext';

const DadosPessoais = ({
  nomeCompleto,
  setNomeCompleto,
  email,
  setEmail,
  numeroMatricula,
  setNumeroMatricula,
  funcao,
  setFuncao,
  onNext,
}) => {
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});
  const { verificarMatricula, verificarEmail } = useContext(UsersContext);

  const handleSubmit = async () => {
    if (numeroMatricula && verificarMatricula) {
      const exists = await verificarMatricula(numeroMatricula);
      if (exists) {
        setErrors((prev) => ({
          ...prev,
          numeroMatricula: `A matrícula '${numeroMatricula}' já está registrada no sistema.`,
        }));
        return;
      }
    }

    if(email && verificarEmail) {
      const emailExists = await verificarEmail(email);
      if (emailExists) { 
        setErrors((prev) => ({
          ...prev,
          email: `O email '${email}' já está registrado no sistema.`,
        }));
        return;
      }
    }

    if (!nomeCompleto || !email || !numeroMatricula || !funcao) {
      setError(true);
      return;
    }

    setError(false);
    if (onNext) onNext();
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
        Dados Pessoais
      </Typography>

      {/* CAMPO NOME */}
      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>
        Nome Completo
      </InputLabel>
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        error={error && !nomeCompleto}
        placeholder={error && !nomeCompleto ? 'Campo Obrigatório *' : ''}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          '& .MuiOutlinedInput-input::placeholder': {
            color: error && !nomeCompleto ? '#FF0000' : 'inherit',
            opacity: error ? 0.8 : 0.5,
            fontSize: 14,
          },
        }}
      />

      {/* CAMPO EMAIL */}
      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>Email</InputLabel>
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error && !email}
        helperText={errors.email}
        placeholder={error && !email ? 'Campo Obrigatório *' : ''}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          '& .MuiOutlinedInput-input::placeholder': {
            color: error && !email ? '#FF0000' : 'inherit',
            opacity: error ? 0.8 : 0.5,
            fontSize: 14,
          },
        }}
      />

      {/* CAMPO MATRICULA */}
      <InputLabel sx={{ color: 'black', fontSize: 16, width: '100%', mb: 1 }}>
        Número de Matrícula
      </InputLabel>
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={numeroMatricula}
        error={error && !numeroMatricula}
        helperText={errors.numeroMatricula}
        onChange={(e) => setNumeroMatricula(e.target.value)}
        placeholder={error && !numeroMatricula ? 'Campo Obrigatório *' : ''}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
          '& .MuiOutlinedInput-input::placeholder': {
            color: error && !numeroMatricula ? '#FF0000' : 'inherit',
            fontSize: 14,
            opacity: error ? 0.8 : 0.5,
          },
          '¨&.MuiFormHelperText-root': {
            color: '#FF0000',
            fontSize: 14,
          },
        }}
      />

      {/* RADIOS (FUNÇÃO) */}
      <Box sx={{ width: '100%' }} mb={4}>
        <Typography sx={{ color: 'black', fontSize: 16, mb: 1 }}>Função</Typography>

        <RadioGroup row sx={{ gap: 2 }} value={funcao} onChange={(e) => setFuncao(e.target.value)}>
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
              borderColor: error && !funcao ? 'error.main' : '#AEAEAE',
              flex: 1,
              '&:hover': { borderColor: error && !funcao ? 'error.dark' : 'black' },
            }}
          >
            <FormControlLabel
              value="Administrador" // Valor que vai pro backend
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
              borderColor: error && !funcao ? 'error.main' : '#AEAEAE',
              flex: 1,
              '&:hover': { borderColor: error && !funcao ? 'error.dark' : 'black' },
            }}
          >
            <FormControlLabel
              value="Tecnico" // Valor que vai pro backend
              control={<Radio />}
              label="Técnico"
              sx={{ width: '100%', margin: 0 }}
            />
          </Box>
        </RadioGroup>

        {error && !funcao && (
          <FormHelperText error sx={{ ml: 1, mt: 1, fontSize: 14, color: '#FF0000' }}>
            Campos Obrigatórios *
          </FormHelperText>
        )}
      </Box>

      {/* BOTÕES */}
      <Box display="flex" gap={2} mt={2} width="100%" justifyContent="flex-end">
        <Button
          onClick={() => navigate('/usuarios')}
          variant="outlined"
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
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#676767',
            color: 'white',
            width: 210,
            height: 35,
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default DadosPessoais;
