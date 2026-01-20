import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, InputAdornment, Button, TextField, Stack, Grid, InputLabel } from '@mui/material';
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
      sx={{ bgcolor: '#D9D9D9', height: '100vh', p: '16px 8px' }}
      container
      alignItems='center'
      justifyContent='center'
    >
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <img src="/images/Motopilot Logo.png" alt="Motopilot Logo" style={{ maxWidth: '100%', height: 'auto', width: '400px' }} />
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{
          backgroundColor: "white", 
        borderRadius: 2, 
        width: '100%',
        minWidth: 700,
        minHeight: 850,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: 3,
        transform: 'translateX(50px)',
        }}
        >
          <Stack spacing={4} alignItems="center" sx={{ px: { xs: 4, sm: 8 }, py: 5 }}>
            <img src="/images/Motopilot Logo-modified.png" alt="Motopilot Logo" width="150" />

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <InputLabel sx={{ color: 'black', fontSize: 16 }}>
                Email
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                fullWidth
                placeholder="Insira seu e-mail"
                variant="outlined"
                value={email}
                error={error}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {error && <WarningIcon color="error" />}
                    </InputAdornment>
                  ),
                }}
              />

              <InputLabel sx={{ color: 'black', fontSize: 16 }}>
                Senha
              </InputLabel>
              <TextField
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                fullWidth
                placeholder="Insira sua senha"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                error={error}
                
                helperText={error ? 'Usuário ou Senha incorretos. Tente novamente ou entre em contato com o ADM' : ' '}
                FormHelperTextProps={{
                  sx: { 
                    minHeight: '1.5em', 
                    margin: 0,
                    marginTop: '4px'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {error && <WarningIcon color="error" />}
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                sx={{ backgroundColor: "#676767", width: "100%", mt: 2, height: 50, borderRadius: 3, fontSize: 15 }}
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