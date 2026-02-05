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
        p: { xs: 2, md: 4 } // Padding menor no celular
      }}
      alignItems='center'
      justifyContent='center'
    >
      {/* Lado Esquerdo: Logo Principal - Esconde em telas muito pequenas se desejar, ou empilha */}
      <Grid item xs={12} md={6} sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: { xs: 4, md: 0 } // Espaço abaixo da logo apenas no mobile
      }}>
        <img 
          src="/images/Motopilot Logo.png" 
          alt="Motopilot Logo" 
          style={{ 
            maxWidth: '80%', 
            height: 'auto', 
            width: '400px' 
          }} 
        />
      </Grid>

      {/* Lado Direito: Formulário */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{
          backgroundColor: "white", 
          borderRadius: 2, 
          width: '100%',
          maxWidth: 500, // Largura máxima para não ficar gigante no desktop
          minHeight: { xs: 'auto', md: 600 }, // Altura automática no mobile
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: 3,
          p: { xs: 3, sm: 6 }, // Padding interno adaptável
        }}>
          <Stack spacing={4} alignItems="center">
            <img src="/images/Motopilot Logo-modified.png" alt="Motopilot Logo" width="90" />

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1 }}>
                Email
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: '#fff',
                    "& fieldset": { borderColor: '#e0e0e0' },
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px white inset",
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

              <InputLabel sx={{ color: 'black', fontSize: 16, mt: 2, mb: 1 }}>
                Senha
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: '#fff',
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
                  backgroundColor: "#676767", 
                  width: "100%", 
                  mt: 3, 
                  height: 50, 
                  borderRadius: 3, 
                  fontSize: 18, 
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#444' }
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