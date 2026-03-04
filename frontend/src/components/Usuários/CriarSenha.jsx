import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputLabel,
  Stack,
  InputAdornment,
} from '@mui/material';
import Check from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const CriarSenha = ({ onBack, register, errors, watch, loading }) => {
  const [showSenha1, setShowSenha1] = useState(false);
  const [showSenha2, setShowSenha2] = useState(false);

  const senhaAtual = watch('senha') || '';
  const confirmarSenhaAtual = watch('confirmarSenha') || '';

  const validacoes = {
    caracteres: senhaAtual.length >= 8 && senhaAtual.length <= 12,
    maiuscula: /[A-Z]/.test(senhaAtual),
    numero: /[0-9]/.test(senhaAtual),
  };

  const senhasConferem = senhaAtual === confirmarSenhaAtual && confirmarSenhaAtual !== '';
  const podeAvancar = validacoes.caracteres && validacoes.maiuscula && validacoes.numero && senhasConferem;

  const renderRequirement = (label, isMet) => (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: isMet ? 0.5 : 1 }}>
      <Check sx={{ fontSize: 16, color: isMet ? 'black' : 'grey' }} />
      <Typography
        variant="caption"
        sx={{
          color: 'black',
          textDecoration: isMet ? 'line-through' : 'none',
          fontSize: '13px',
        }}
      >
        {label}
      </Typography>
    </Stack>
  );

  return (
    <Box
      sx={{
        backgroundColor: '#E0E0E0',
        p: 4,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        minHeight: '550px',
        margin: '0 auto',
        fontFamily: 'Roboto, sans-serif',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        mt: 2,
      }}
    >
      {/* --- Cabeçalho --- */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <IconButton
          onClick={onBack}
          disabled={loading}
          sx={{
            position: 'absolute',
            left: 0,
            top: -5,
            color: '#000000',
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" align="center" sx={{ color: '#333', fontWeight: 500 }}>
          Criar senha
        </Typography>
      </Box>

      {/* --- Área Central (Inputs) --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '400px', margin: '0 auto', mt: 4 }}>
        <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>Senha</InputLabel>
        <TextField
          type={showSenha1 ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          size="small"
          {...register('senha')} 
          error={!!errors.senha}
          helperText={errors.senha?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowSenha1(!showSenha1)} edge="end">
                  <img src={showSenha1 ? '/images/olhoAberto.png' : '/images/olhoFechado.png'} alt="Mostrar" style={{ width: '20px' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#E0E0E0' },
            '& input[type="password"]': { letterSpacing: '0.3em' },
          }}
        />

        <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>Confirmar Senha</InputLabel>
        <TextField
          type={showSenha2 ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          size="small"
          {...register('confirmarSenha')}
          error={!!errors.confirmarSenha}
          helperText={errors.confirmarSenha?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowSenha2(!showSenha2)} edge="end">
                  <img src={showSenha2 ? '/images/olhoAberto.png' : '/images/olhoFechado.png'} alt="Mostrar" style={{ width: '20px' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#E0E0E0' },
            '& input[type="password"]': { letterSpacing: '0.3em' },
          }}
        />

        <Stack spacing={0.5} mt={1}>
          <Typography variant="caption" sx={{ color: 'black', fontSize: 16, mb: 1 }}>
            Sua senha deve conter
          </Typography>
          {renderRequirement('de 8 a 12 caracteres', validacoes.caracteres)}
          {renderRequirement('1 letra maiúscula', validacoes.maiuscula)}
          {renderRequirement('1 número', validacoes.numero)}
          {renderRequirement('Senhas coincidem', senhasConferem)}
        </Stack>
      </Box>

      {/* --- Rodapé --- */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          sx={{
            color: '#333',
            borderColor: '#999',
            borderRadius: '8px',
            textTransform: 'none',
            px: 7,
            width: '100px',
            '&:hover': { borderColor: '#666', backgroundColor: 'rgba(0,0,0,0.05)' },
          }}
        >
          Voltar
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={!podeAvancar || loading}
          sx={{
            backgroundColor: '#444',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            width: '140px',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': { backgroundColor: '#222', boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: '#bbb', color: '#eee', cursor: 'not-allowed' },
          }}
        >
          {loading ? 'Salvando...' : 'Concluir'}
        </Button>
      </Box>
    </Box>
  );
};

export default CriarSenha;