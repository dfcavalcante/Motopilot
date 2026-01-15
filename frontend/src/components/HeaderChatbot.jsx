import { useState } from 'react';
import {Box, Typography, Button} from '@mui/material';
import React from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

//Pequena Header em cima do Chatbot, tem os ícones, nome e novo chat
const HeaderChatBot = () =>{
    const [nome, setNome] = useState('');

    return(
    <Box 
        width={1200} 
        height={100} 
        variant='outlined' 
        display='flex' 
        direction='row'
        backgroundColor='white'
    >
        <Box variant='outlined' color='grey.700' >
            <PersonOutlineOutlinedIcon/>
        </Box>

        <Box>
            aq vai outro icone
            <Button
                variant='outlined'
                color='grey.700'    
            > 
            
            novo chat 
            </Button>
        </Box>

        <NotificationsNoneOutlinedIcon/>
    </Box>
    )
}

export default HeaderChatBot;