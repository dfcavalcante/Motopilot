import { useState } from 'react';
import {Box, Typography, Button, IconButton, Divider, TextField} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useLocation } from 'react-router-dom';

//Pequena Header em cima do Chatbot, tem os ícones, nome e novo chat
const HeaderChatBot = ({ nomeChat, setNomeChat, onNovoChat }) =>{
    const [editando, setEditando] = useState(false);
    const [tempNome, setTempNome] = useState(nomeChat);
    const navigate = useNavigate();
    const location = useLocation();

    const handleCadastroMoto = async (e) => {
        e.preventDefault();
        navigate('/cadastroMoto');
    };

    const handleCadastroUsuario = async (e) => {
        e.preventDefault();
        navigate('/cadastro');
    }

    const handleSalvarNome = () => {
        setNomeChat(tempNome);
        setEditando(false);
    };

    const handlePaginaAtual = () => {
        if(location.pathname === '/chatbot'){
            return (
                <Button
                variant='outlined'
                startIcon={<img src="/images/add.png" alt="Add" width="20" />}
                sx={{ 
                    color: 'black', 
                    borderColor: 'black',
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: 2,
                    '&:hover': { borderColor: 'black', backgroundColor: 'transparent' }
                }}
            > 
                Novo chat 
            </Button>
            )
        }
        if(location.pathname === '/listagemMotos'){
            return (
            <Button
                variant='outlined'
                startIcon={<img src="/images/add.png" alt="Add" width="20" />}
                onClick={handleCadastroMoto}
                sx={{ 
                    color: 'black', 
                    borderColor: 'black',
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: 2,
                    '&:hover': { borderColor: 'black', backgroundColor: 'transparent' }
                }}
            > 
                Adicionar moto
            </Button>
            )
        }
        if(location.pathname === '/usuarios'){
            return(
            <Button
                variant='outlined'
                startIcon={<img src="/images/add.png" alt="Add" width="20" />}
                onClick={handleCadastroUsuario}
                sx={{ 
                    color: 'black', 
                    borderColor: 'black',
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: 2,
                    '&:hover': { borderColor: 'black', backgroundColor: 'transparent' }
                }}
            > 
                Adicionar usuário
            </Button>
            )
        }
    }

    //Tirando do return, pois o Fernando não aprovou ainda
    {editando ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField size="small" value={tempNome} onChange={(e) => setTempNome(e.target.value)} />
                        <IconButton onClick={handleSalvarNome} color="success"><CheckIcon /></IconButton>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="grey.600" fontStyle="italic">{nomeChat}</Typography>
                        <IconButton size="small" onClick={() => setEditando(true)}><EditIcon fontSize="small" /></IconButton>
                    </Box>
                )}

    return(
    <Box 
        sx={{
            width: '100%', 
            height: 70, 
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'space-between', 
            px: 3, 
            backgroundColor: 'white',
            borderBottom: '1px solid #E0E0E0', 
            boxSizing: 'border-box'
        }}
    >
        {/* Perfil, nome e sobrenome */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                    border: '1px solid black',
                    display: 'inline-flex',   
                    p: 1.5,                     
                    borderRadius: '8px'        
                }}>
                    <img src="/images/person.png" alt="Logo" width="12" />
                </Box>
                
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, alignSelf: 'center' }} />

                <Typography> Nome Sobrenome</Typography>
                
            </Box>

        </Box>

        {/* Notificações e novo chat*/}
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            gap: 2,                    
            }}>

            {handlePaginaAtual()}

            <Box sx={{ 
                    border: '1px solid black',
                    display: 'inline-flex',                    
                    borderRadius: '8px'        
                }}>
                <IconButton sx={{ color: 'grey.700' }}>
                    <img src="/images/bell.png" alt="Logo" width="15" />
                </IconButton>
            </Box>
        </Box>
            
        </Box>
    )
}

export default HeaderChatBot;