import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, TextField, Divider } from '@mui/material';
import React from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const HeaderChatBot = ({ nomeChat, setNomeChat, onNovoChat }) => {
    const [editando, setEditando] = useState(false);
    const [tempNome, setTempNome] = useState(nomeChat);

    useEffect(() => { setTempNome(nomeChat); }, [nomeChat]);

    const handleSalvarNome = () => {
        setNomeChat(tempNome);
        setEditando(false);
    };

    return (
        <Box sx={{
            width: '100%', height: 70, display: 'flex', alignItems: 'center',
            borderRadius: '20px', justifyContent: 'space-between', px: 3,
            backgroundColor: 'white', borderBottom: '1px solid #E0E0E0', boxSizing: 'border-box'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ border: '1px solid black', display: 'inline-flex', p: 0.5, borderRadius: '8px' }}>
                    <PersonOutlineOutlinedIcon />
                </Box>
                <Typography variant="body1" fontWeight={500}>Usuário</Typography>
                
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 20, alignSelf: 'center' }} />

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
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                    variant='outlined' 
                    startIcon={<AddCircleOutlineOutlinedIcon />} 
                    onClick={onNovoChat}
                    sx={{ color: 'black', borderColor: 'black', textTransform: 'none' }}
                >
                    Novo chat
                </Button>
                <IconButton sx={{ border: '1px solid black', borderRadius: '8px' }}>
                    <NotificationsNoneOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default HeaderChatBot;