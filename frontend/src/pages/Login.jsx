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
    <Grid sx={{bgcolor: 'grey.500'}} container style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6} margin={8}>
            <img src="/images/Motopilot Logo.jpeg" alt="Motopilot Logo" width="400" height={200} />
        </Grid>

        <Grid item xs={12} sm={6} margin={3}>
            <Box backgroundColor="white" justifyContent={'center'} borderRadius={2} width={500} height={700}>
                <Stack spacing={4} alignItems="center" justifyContent="center" paddingLeft={8} paddingRight={8} paddingTop={10}>
                        <img src="/images/Motopilot Logo-modified.png" alt="Motopilot Logo" width="100" />

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