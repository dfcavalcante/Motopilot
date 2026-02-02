import React from "react";
import { Box, Typography, Stack, Divider, IconButton } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';


const SideBar = ({ historico = [] }) => {
  const [open, setOpen] = React.useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    { name: "Início", link: "/chatbot", icon: <img src="/images/Home.svg" alt="Logo" width="20" /> },
    { name: "Motos", link: "/listagemMotos" , icon: <img src="/images/Folder.svg" alt="Logo" width="20" /> },
    { name: "Usuários", link: "/relatorio", icon: <img src="/images/users.png" alt="Logo" width="20" /> },
  ];

  return (
    <Box sx={{
        backgroundColor: "white",
        width: open ? "240px" : "80px", 
        transition: "width 0.3s ease", 
        height: "100%", 
        borderRadius: "16px", 
        display: "flex",
        flexDirection: "column",
        p: "20px",
        boxSizing: "border-box",
        position: "relative" 
    }}>
      <IconButton 
        onClick={() => setOpen(!open)}
        sx={{ position: "absolute", right: -15, top: 60, backgroundColor: "white", boxShadow: 2, zIndex: 10 }}
        size="small"
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      <Stack spacing={2} sx={{ height: '100%', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!open && <img src="/images/Motopilot Logo-modified.png" alt="Logo" width="40" />}
          {open && <img src="/images/Motopilot Logo.png" alt="Logo" width="180" height={30} />}
        </Box>

        <Divider />

        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1 
        }}>


        {open && (
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'grey.500', fontWeight: 'bold', mb: 1, display: 'block' }}>
                    CONVERSAS RECENTES
                </Typography>
                <Stack spacing={0.5}>
                    {historico.map((chat) => (
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
                    ))}
                </Stack>
            </Box>
        )}

        {/* MENUS DE NAVEGAÇÃO */}
        <Box>
            {menus.map((menu, index) => (
                <Box
                    key={index}
                    onClick={() => navigate(menu.link)}
                    sx={{
                        display: "flex", alignItems: "center", gap: "15px", cursor: "pointer",
                        padding: "12px", borderRadius: "12px", mb: 1,
                        justifyContent: open ? 'flex-start' : 'center',
                        backgroundColor: location.pathname === menu.link ? "#f0f0f0" : "transparent",
                        "&:hover": { backgroundColor: "#f5f5f5" }
                    }}
                >
                    {menu.icon}
                    {open && <Typography sx={{ fontWeight: 500 }}>{menu.name}</Typography>}
                </Box>
            ))}
        </Box>
      </Box>

      {/* --- RODAPÉ (Logout) --- */}
      <Box sx={{ mt: 1 }}> 
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
             <img src="/images/logout.png" alt="Logo" width="20" />
            {open && <Typography sx={{ fontWeight: 500 }}>Sair</Typography>}
        </Box>
      </Box>

      </Stack>
    </Box>
  );
};

export default SideBar;