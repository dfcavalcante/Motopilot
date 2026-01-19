import { useState } from 'react';
import {Box, Typography, Button, IconButton} from '@mui/material';
import React from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

//Pequena Header em cima do Chatbot, tem os ícones, nome e novo chat
const HeaderChatBot = () =>{
    const [nome, setNome] = useState('nome e sobrenome');

    return(
    <Box 
        sx={{
            width: '100%', 
            height: 70, 
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between', // Empurra os grupos para as extremidades
            px: 3, // Padding lateral
            backgroundColor: 'white',
            borderBottom: '1px solid #E0E0E0', // Linha discreta inferior
            boxSizing: 'border-box'
        }}
    >
        {/* Perfil, nome e sobrenome */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                    border: '1px solid black',
                    display: 'inline-flex',   
                    p: 1,                     
                    borderRadius: '8px'        
                }}>
                    <PersonOutlineOutlinedIcon sx={{ color: 'grey.700' }} />
                </Box>
                
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'grey.800' }}>
                    {nome}
                </Typography>
            </Box>

        </Box>

        {/* Notificações e novo chat*/}
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            gap: 2,                    
            }}>
            <Button
                variant='outlined'
                startIcon={<AddCircleOutlineOutlinedIcon />}
                sx={{ 
                    color: 'black', 
                    borderColor: 'black',
                    borderRadius: '8px',
                    textTransform: 'none',
                    px: 2,
                    '&:hover': { borderColor: 'black', backgroundColor: 'transparent' }
                }}
            > 
                novo chat 
            </Button>

            <Box sx={{ 
                    border: '1px solid black',
                    display: 'inline-flex',                    
                    borderRadius: '8px'        
                }}>
                <IconButton sx={{ color: 'grey.700' }}>
                    <NotificationsNoneOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
            
        </Box>
    )
}

export default HeaderChatBot;