import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Stack, Button, TextField, Divider, Grid, Typography, Card, CardActionArea } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HeaderChatBot from '../components/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import SugestaoChatbot from '../components/SugestaoChatbot.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useChat } from '../context/useChat.js';

//Importações do Escolher Moto, separado para caso ocorra mudanças depois
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CircularProgress,} from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

const Chatbot = () => {
  const { 
    motos, 
    motoSelecionada, 
    setMotoSelecionada, 
    messages, 
    carregandoMotos, 
    enviarMensagem,
  } = useChat();

  const [input, setInput] = useState('');
  const [nomeChat, setNomeChat] = useState('Nome Chat');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendClick = () => {
      enviarMensagem(input);
      setInput('');
  };

  const sugestoes = [
    "Qual a pressão dos pneus?",
    "Como fazer a troca de óleo?",
    "O que fazer se a moto não ligar?",
    "O que fazer se o motor não funcionar?"
  ];

  // A área de perguntar do chatr
  const inputArea = (
    <Box sx={{ width: '100%', maxWidth: 720, mt: 2, flexShrink: 0 }}>
        <TextField
            sx={{
            "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": { borderRadius: "10px" },
                alignItems: 'flex-end'
            },
            }}
            placeholder="Pergunte alguma coisa..."
            fullWidth
            multiline
            maxRows={6}
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendClick();
                }
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <AddIcon sx={{ color: 'black', cursor:'pointer' }} />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                      <ArrowCircleUpIcon sx={{ color: 'black', cursor: 'pointer' }} onClick={() => handleSend()} />
                    </InputAdornment>
                ),
            }}
        />
    </Box>
  );

  return (
    
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: "#989898", 
        p: '16px', 
        boxSizing: 'border-box'
      }}
    >
      <SideBar />

      <Dialog 
        open={!motoSelecionada} // Abre automaticamente se não tiver moto
        disableEscapeKeyDown={true} // Não deixa fechar com ESC
        maxWidth="xs" // Limita a largura
        fullWidth
        PaperProps={{
            sx: { 
                bgcolor: '#1e1e1e', // Cor de fundo escura
                color: 'white',
                borderRadius: 3,
                border: '1px solid #333',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', borderBottom: '1px solid #333', pb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
                {carregandoMotos ? "Carregando..." : "Escolha sua Moto"}
            </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, p: 0 }}>
            {carregandoMotos ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress sx={{ color: '#90caf9' }} />
                </Box>
            ) : (
                <List sx={{ p: 2 }}>
                    {/* Caso a lista esteja vazia */}
                    {motos.length === 0 && (
                        <Typography align="center" color="gray" sx={{ py: 2 }}>
                            Nenhuma moto encontrada.
                        </Typography>
                    )}

                    {motos.map((moto) => (
                        <ListItem key={moto.id} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton 
                                onClick={() => setMotoSelecionada(moto)}
                                sx={{ 
                                    borderRadius: 2, 
                                    bgcolor: '#252525',
                                    border: '1px solid transparent',
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        bgcolor: '#333', 
                                        borderColor: '#90caf9',
                                        transform: 'translateY(-2px)'
                                    } 
                                }}
                            >
                                <ListItemIcon>
                                    <TwoWheelerIcon sx={{ color: '#90caf9' }} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={moto.modelo} 
                                    secondary={`${moto.marca} • ${moto.ano}`}
                                    primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
                                    secondaryTypographyProps={{ color: '#aaa' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </DialogContent>
      </Dialog>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          ml: '20px', 
          height: '100%'
        }}
      >
        <Stack spacing="8px" sx={{ height: '100%' }}>
          
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "white",
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              overflow: 'hidden'
            }}
          >
            <Typography variant="h6" mb={2}>
                {nomeChat}
            </Typography>

            <Divider 
                sx={{ 
                    width: '90%',     
                    backgroundColor: 'grey.700',
                    height: '0.4px',    
                    mb: 2,     
                }} 
            />

            {messages.length === 0 ? (
                <Box sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center', 
                    overflowY: 'auto',
                    width: '100%',
                    maxWidth: 720
                }}>
                    <Box sx={{ 
                        border: '1px solid black',
                        display: 'inline-flex',   
                        p: 1,                     
                        borderRadius: '8px',
                        mb: 2    
                    }}>
                        <SentimentSatisfiedAltIcon/>
                    </Box>

                    <Typography variant="body1" gutterBottom color='grey.800'>
                        Olá, Tudo bem?
                    </Typography>
                    <Typography variant="h4" gutterBottom mb={3} fontWeight={'bold'}>
                        Como podemos te ajudar?
                    </Typography>

                    {inputArea} 

                    <Box sx={{ width: '100%', mt: 5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LightbulbOutlinedIcon fontSize="small" />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Dúvidas frequentes
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            {sugestoes.slice(0, 4).map((sugestao, index) => (
                            <Grid item xs={6} key={index}>
                                <div onClick={() => handleSendClick(sugestao)} style={{ cursor: 'pointer' }}>
                                    <SugestaoChatbot sugestao={sugestao} sx={{ width: '100%' }} />
                                </div>
                            </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            ) : (
                /*Parte da conversa */
                <>
                    <Box 
                        sx={{ 
                            flexGrow: 1, 
                            width: '100%', 
                            maxWidth: 720,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            mb: 2
                        }}
                    >
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} text={msg.text} isBot={msg.isBot} />
                        ))}
                        {isLoading && <Typography variant="caption" sx={{ ml: 2 }}>Digitando...</Typography>}
                    </Box>

                    {inputArea}
                </>
            )}

          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default Chatbot;