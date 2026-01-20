import React from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { useLocation, useNavigate } from 'react-router-dom'; 

const SideBar = () => {
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const menus = [
    { name: "Chatbot", link: "/chatbot", icon: <HomeOutlinedIcon /> },
    //não sei o que significa essa pasta de projetos, mas está no protótipo do figma
    { name: "Projetos", link: "/projetos" , icon: <FolderOpenOutlinedIcon /> },
  ];

  const logoutMenu = { name: "Sair", link: "/", icon: <LogoutIcon /> };

  return (
    <Box
    sx={{
        backgroundColor: "white",
        width:  "80px",
        height: "100%", 
        borderRadius: "20px", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "20px",
        boxSizing: "border-box"
    }}
    >
      {/* Parte Superior: Menus Principais */}
      <Box>
        <Stack spacing={2}>
          <img src="/images/Motopilot Logo-modified.png" alt="Motopilot Logo" width="50" />

          <Divider 
                sx={{ 
                    width: '100%',     
                    backgroundColor: 'grey.700',
                    height: '0.4px',    
                    mb: 10,     
                }} 
            />

          {menus.map((menu, index) => (
            
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#f5f5f5" }
              }}
              
            >
              {menu.icon}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Parte Inferior: Logout */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          cursor: "pointer",
          padding: "10px",
          borderRadius: "8px",
          "&:hover": { backgroundColor: "#fff5f5" }
        }}
      >
        {logoutMenu.icon}
      </Box>
    </Box>

    );

};

export default SideBar;