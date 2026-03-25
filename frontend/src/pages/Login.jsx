import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, InputAdornment, Button, TextField, Stack, Grid, InputLabel } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useLogin } from '../context/LoginContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const { login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      await login(email, password);

      setError(false);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient( #E71010,#990000)',
        pl: { xs: 2, md: 15 },
        pr: { xs: 2, md: 4 },
        py: 4,
        color: '#faeeee',
      }}
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Lado Esquerdo: Logo Principal */}
      <Grid>
        <img
          src="/images/LogoLogin.png"
          alt="Motopilot Logo"
          style={{
            maxWidth: '100%',
            height: '90px',
            width: '700px',
          }}
        />
      </Grid>

      {/* Lado Direito: Formulário */}
      <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
            width: { xs: '100%', md: '700px' }, //aq q muda a altura
            minHeight: { xs: 'auto', md: 800 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 6, md: 16 }, //aq q muda o padding do form, ficar mais longe das bordas
          }}
        >
          <Stack spacing={4} alignItems="center">
            <img src="/images/LogoNova.png" alt="Motopilot Logo" width="90" />

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>Email</InputLabel>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '& fieldset': {
                      borderColor: '#969696',
                    },
                    '&:hover fieldset': {
                      borderColor: '#969696',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#969696 !important', // O !important força a remoção do azul
                      borderWidth: '1px !important', 
                    },
                  },
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px white inset',
                  },
                }}
                fullWidth
                placeholder="Insira seu e-mail"
                variant="outlined"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {error && <WarningIcon color="error" />}
                    </InputAdornment>
                  ),
                }}
              />

              <InputLabel sx={{ color: 'black', fontSize: 16, mt: 2, mb: 1 }}>Senha</InputLabel>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '& fieldset': {
                      borderColor: '#969696',
                    },
                    '&:hover fieldset': {
                      borderColor: '#969696',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#969696 !important', // O !important força a remoção do azul
                      borderWidth: '1px !important',
                    },
                  },
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px white inset',
                  },
                  '& input': {
                    letterSpacing: '6px',
                  },
                  '& input::placeholder': {
                    letterSpacing: 'normal',
                  },
                }}
                fullWidth
                placeholder="Insira sua senha"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="dense"
                error={error}
                helperText={error ? 'Usuário ou Senha incorretos.' : ' '}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {error && <WarningIcon color="error" />}
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                sx={{
                  backgroundColor: '#F30000',
                  width: '100%',
                  mt: 3,
                  height: 50,
                  borderRadius: 3,
                  fontSize: 18,
                  textTransform: 'none',
                }}
                type="submit"
                variant="contained"
              >
                Entrar
              </Button>
            </form>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
