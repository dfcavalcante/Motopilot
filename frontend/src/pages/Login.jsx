import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, InputAdornment, Button, TextField, Stack, Grid, InputLabel } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(true);
      return;
    } else {
      setError(false);
      navigate('/chatbot');
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: '100vh',
        bgcolor: '#D9D9D9',
        pl: { xs: 2, md: 40 },
        pr: { xs: 2, md: 4 },
        py: 4,
      }}
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Lado Esquerdo: Logo Principal */}
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          mb: { xs: 4, md: 0 },
        }}
      >
        <img
          src="/images/Motopilot Logo.png"
          alt="Motopilot Logo"
          style={{
            maxWidth: '80%',
            height: '300px',
            width: '550px',
          }}
        />
      </Grid>

      {/* Lado Direito: Formulário */}
      <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            width: { xs: '100%', md: '860px' }, //aq q muda a altura
            minHeight: { xs: 'auto', md: 850 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 6, md: 16 }, //aq q muda o padding do form, ficar mais longe das bordas
          }}
        >
          <Stack spacing={4} alignItems="center">
            <img src="/images/Motopilot Logo-modified.png" alt="Motopilot Logo" width="90" />

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>Email</InputLabel>
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#e0e0e0' },
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
                    '& fieldset': { borderColor: '#e0e0e0' },
                  },
                  '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px white inset',
                  },
                  '& input': {
                    letterSpacing: '6px', // aq é para aumentar espaço entre caracteres da senha
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
                  backgroundColor: '#676767',
                  width: '100%',
                  mt: 3,
                  height: 50,
                  borderRadius: 3,
                  fontSize: 18,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#444' },
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
