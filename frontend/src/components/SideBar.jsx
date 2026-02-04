import React from "react";
import { Box, Typography, Stack, Divider, IconButton } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const SideBar = ({ historico = [] }) => {
  const [open, setOpen] = React.useState(true); // Iniciado como true para visualização clara
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    { name: "Início", link: "/chatbot", icon: <img src="/images/Home.svg" alt="Início" width="20" /> },
    { name: "Motos", link: "/listagemMotos", icon: <img src="/images/Folder.svg" alt="Motos" width="20" /> },
    { name: "Usuários", link: "/relatorio", icon: <img src="/images/users.png" alt="Usuários" width="20" /> },
  ];

  return (
    <Box sx={{
        backgroundColor: "white",
        width: open ? "260px" : "80px", 
        transition: "width 0.3s ease", 
        height: "100%", 
        borderRadius: "16px", 
        display: "flex",
        flexDirection: "column",
        p: "20px",
        boxSizing: "border-box",
        position: "relative" 
    }}>
      {/* Botão de abrir/fechar */}
      <IconButton 
        onClick={() => setOpen(!open)}
        sx={{ 
            position: "absolute", 
            right: -15, 
            top: 60, 
            backgroundColor: "white", 
            boxShadow: 2, 
            zIndex: 10,
            '&:hover': { backgroundColor: '#f0f0f0' }
        }}
        size="small"
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      <Stack spacing={2} sx={{ height: '100%', overflow: 'hidden' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-start' : 'center', gap: 2, minHeight: '40px' }}>
          {!open && <img src="/images/Motopilot Logo-modified.png" alt="Logo" width="30" />}
          {open && <img src="/images/Motopilot Logo.png" alt="Logo" width="160" />}
        </Box>

        <Divider />

        {/* CONTAINER PRINCIPAL (Scrollable) */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column',
          pr: open ? 1 : 0, // Espaço para não sobrepor a scrollbar no texto
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#e0e0e0', borderRadius: '10px' }
        }}>

          {/* 1. SEÇÃO DE HISTÓRICO (Fica no topo) */}
          {open && (
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'grey.500', fontWeight: 'bold', mb: 1, display: 'block', ml: 1 }}>
                    CONVERSAS RECENTES
                </Typography>
                <Stack spacing={0.5}>
                    {historico.length > 0 ? (
                        historico.map((chat) => (
                            <Box
                                key={chat.id}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: '8px',
                                    cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                            >
                                <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: 'grey.600' }} />
                                <Typography variant="body2" noWrap sx={{ color: 'grey.800' }}>
                                    {chat.nome}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="caption" sx={{ color: 'grey.400', fontStyle: 'italic', ml: 1 }}>
                            Nenhuma conversa recente
                        </Typography>
                    )}
                </Stack>
            </Box>
          )}

          {/* 2. MENUS DE NAVEGAÇÃO (Logo abaixo do histórico) */}
          <Box sx={{ mt: 1 }}>
              {menus.map((menu, index) => (
                  <Box
                      key={index}
                      onClick={() => navigate(menu.link)}
                      sx={{
                          display: "flex", alignItems: "center", gap: "15px", cursor: "pointer",
                          padding: "12px", borderRadius: "12px", mb: 0.5,
                          justifyContent: open ? 'flex-start' : 'center',
                          backgroundColor: location.pathname === menu.link ? "#f0f0f0" : "transparent",
                          "&:hover": { backgroundColor: "#f5f5f5" }
                      }}
                  >
                      {menu.icon}
                      {open && <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{menu.name}</Typography>}
                  </Box>
              ))}
          </Box>
        </Box>

        {/* --- RODAPÉ (Logout) --- */}
        <Box sx={{ mt: 'auto' }}> 
          <Divider sx={{ mb: 1 }} />
          <Box
              onClick={() => navigate("/")}
              sx={{
                  display: "flex", alignItems: "center", gap: "15px", cursor: "pointer",
                  padding: "12px", borderRadius: "12px",
                  justifyContent: open ? 'flex-start' : 'center', 
                  "&:hover": { backgroundColor: "#fff5f5", color: "red" }
              }}
          >
               <img src="/images/logout.png" alt="Sair" width="20" />
              {open && <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Sair</Typography>}
          </Box>
        </Box>

      </Stack>
    </Box>
  );
};

export default SideBar;