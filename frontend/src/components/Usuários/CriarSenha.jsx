import React, { useState, useCallback } from 'react';
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

const CriarSenha = ({ onBack, onNext }) => {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha1, setShowSenha1] = useState(false);
  const [showSenha2, setShowSenha2] = useState(false);

  // Lógica de validação
  const validacoes = {
    caracteres: (senha || '').length >= 8 && (senha || '').length <= 12,
    maiuscula: /[A-Z]/.test(senha || ''),
    numero: /[0-9]/.test(senha || ''),
  };

  const todosRequisitosMet = validacoes.caracteres && validacoes.maiuscula && validacoes.numero;
  const senhasConferem = senha === confirmarSenha && confirmarSenha !== '';
  const podeAvancar = todosRequisitosMet && senhasConferem;

  // Função para estilizar o item da lista
  const renderRequirement = (label, isMet) => (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: isMet ? 0.5 : 1 }}>
      <Check sx={{ fontSize: 16, color: 'black' }} />
      <Typography
        variant="caption"
        sx={{
          color: 'black',
          textDecoration: isMet ? 'line-through' : 'none', // Risca o texto se concluído
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
          sx={{
            position: 'absolute',
            left: 0,
            top: -5,
            color: '#000000',
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" align="center" sx={{ color: '#333', fontWeight: 500 }}>
          Criar senha
        </Typography>
      </Box>

      {/* --- Área Central --- */}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          mt: 4,
        }}
      >
        {/* Campo Senha */}
        <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>Senha</InputLabel>
        <TextField
          type={showSenha1 ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          size="small"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowSenha1(!showSenha1)} edge="end">
                  <img
                    src={showSenha1 ? '/images/olhoAberto.png' : '/images/olhoFechado.png'}
                    alt="Mostrar senha"
                    style={{ width: '20px' }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#E0E0E0',
            },
            // Estilo para as bolinhas da senha ficarem afastadas
            '& input[type="password"]': {
              letterSpacing: '0.3em',
            },
          }}
        />

        {/* Campo Confirmar Senha */}
        <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>Confirmar Senha</InputLabel>
        <TextField
          type={showSenha2 ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          size="small"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowSenha2(!showSenha2)} edge="end">
                  <img
                    src={showSenha2 ? '/images/olhoAberto.png' : '/images/olhoFechado.png'}
                    alt="Mostrar senha"
                    style={{ width: '20px' }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              bgcolor: '#E0E0E0',
            },
            // Estilo para as bolinhas da senha ficarem afastadas
            '& input[type="password"]': {
              letterSpacing: '0.3em',
            },
          }}
        />

        {/* Lista de Requisitos */}
        <Stack spacing={0.5} mt={1}>
          <Typography variant="caption" sx={{ color: 'black', fontSize: 16, mb: 1 }}>
            Sua senha deve conter
          </Typography>
          {renderRequirement('de 8 a 12 caracteres', validacoes.caracteres)}
          {renderRequirement('1 letra maiúscula', validacoes.maiuscula)}
          {renderRequirement('1 número', validacoes.numero)}
        </Stack>
      </Box>

      {/* --- Rodapé --- */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            color: '#333',
            borderColor: '#999',
            borderRadius: '8px',
            textTransform: 'none',
            px: 7,
            width: '100px',
            '&:hover': {
              borderColor: '#666',
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!podeAvancar}
          sx={{
            backgroundColor: '#444',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            px: 4,
            width: '140px',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#222',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              backgroundColor: '#bbb',
              color: '#eee',
              cursor: 'not-allowed',
            },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default CriarSenha;
