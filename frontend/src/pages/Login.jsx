import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Input, Button, TextField, Stack, Grid} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

    return (
    <Grid 
        sx={{bgcolor: 'grey.500', height: '100vh', paddingX: 4 }} 
        container
        spacing={40} 
        alignItems='center'
        justifyContent='center'
        
    >
        <Grid item xs={12} md={6} sx={{display:'flex', justifyContent:'center'}}>
            <img src="/images/Motopilot Logo.jpeg" alt="Motopilot Logo" style={{maxWidth: '100%', height:'auto', width:'400px'}}/>
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
                boxShadow: 3
            }}
            >
                    <Stack spacing={4} alignItems="center" sx={{ px: { xs: 4, sm: 8 }, py: 5 }}>
                        <img src="/images/Motopilot Logo-modified.png" alt="Motopilot Logo" width="150" />

                    <form onSubmit={handleSubmit}>
                        <TextField
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                borderRadius: "10px", 
                                "& fieldset": {
                                    borderRadius: "10px",
                                },
                                },
                            }}
                            fullWidth
                            label="Usuário"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                borderRadius: "10px", 
                                "& fieldset": {
                                    borderRadius: "10px",
                                },
                                },
                            }}
                            fullWidth
                            label="Senha"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                        />

                        <Button
                            sx={{ backgroundColor: "grey.700", width: "100%", mt: 2, height: 50, borderRadius: 3, fontSize: 15 }}
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
    )

}

export default Login;