import React from "react";
import { Box } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

const SideBar = () => {
  const [open, setOpen] = React.useState(true);
  const menus = [
    { name: "Chatbot", link: "/chatbot", icon: <HomeOutlinedIcon /> },
    //não sei o que significa essa pasta de projetos, mas está no protótipo do figma
    { name: "Projetos", link: "/projetos" , icon: <FolderOpenOutlinedIcon /> },
    { name: "Sair", link: "/" , icon: <LogoutIcon /> },
  ];

  return (
    <Box
        backgroundColor="white"
        width="25px"
        height="100px"
        boxShadow="2px 0 5px rgba(0,0,0,0.1)"
        padding="20px"
        borderRadius="8px"
    >
        {menus.map((menu, index) => (
            <Box
                key={index}
                marginBottom="20px"
                sx={{ cursor: "pointer" }}
            >
                {menu.icon}
                {open && <span>{menu.name}</span>}
            </Box>
        ))}

    </Box>

    );

};

export default SideBar;