import React from "react";
import { Box, Typography, Stack, Divider, IconButton } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation, useNavigate } from 'react-router-dom'; 

const SideBar = () => {
  const [open, setOpen] = React.useState(false); // Começa fechada conforme seu design atual
  const location = useLocation();
  const navigate = useNavigate();
  
  const menus = [
    { name: "Chatbot", link: "/chatbot", icon: <HomeOutlinedIcon /> },
    { name: "Projetos", link: "/projetos" , icon: <FolderOpenOutlinedIcon /> },
  ];

  const logoutMenu = { name: "Sair", link: "/", icon: <LogoutIcon /> };

  return (
    <Box
    sx={{
        backgroundColor: "white",
        width: open ? "240px" : "80px", // Largura dinâmica
        transition: "width 0.3s ease", // Animação suave ao abrir/fechar
        height: "100%", 
        borderRadius: "20px", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "20px",
        boxSizing: "border-box",
        position: "relative" // Necessário para posicionar o botão de seta
    }}
    >
      {/* Botão de Seta para Abrir/Fechar */}
      <IconButton 
        onClick={() => setOpen(!open)}
        sx={{
            position: "absolute",
            right: -15,
            top: 60,
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
            zIndex: 10
        }}
        size="small"
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      {/* Parte Superior: Menus Principais */}
      <Box sx={{ overflow: "hidden" }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/images/Motopilot Logo-modified.png" alt="Motopilot Logo" width="40" />
            {open && <Typography variant="h6" fontWeight="bold">MotoPilot</Typography>}
          </Box>

          <Divider sx={{ backgroundColor: 'grey.300', my: 2 }} />

          {menus.map((menu, index) => (
            <Box
              key={index}
              onClick={() => navigate(menu.link)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: location.pathname === menu.link ? "#f0f0f0" : "transparent",
                "&:hover": { backgroundColor: "#f5f5f5" },
                minWidth: "max-content"
              }}
            >
              {menu.icon}
              {open && <Typography sx={{ fontWeight: 500 }}>{menu.name}</Typography>}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Parte Inferior: Logout */}
      <Box
        onClick={() => navigate(logoutMenu.link)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          cursor: "pointer",
          padding: "12px",
          borderRadius: "12px",
          "&:hover": { backgroundColor: "#fff5f5", color: "red" },
          minWidth: "max-content"
        }}
      >
        {logoutMenu.icon}
        {open && <Typography sx={{ fontWeight: 500 }}>{logoutMenu.name}</Typography>}
      </Box>
    </Box>
  );
};

export default SideBar;