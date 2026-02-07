import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

// Pequena Header em cima do Chatbot, tem os ícones, nome e novo chat
const HeaderChatBot = ({onNovoChat }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCadastroMoto = (e) => {
    e.preventDefault();
    navigate("/cadastroMoto");
  };

  const handleCadastroUsuario = async (e) => {
    e.preventDefault();
    navigate("/cadastro");
  };


  const handlePaginaAtual = () => {
    if (location.pathname === "/chatbot") {
      return (
        <Button
            variant="outlined"
            startIcon={<img src="/images/add.png" alt="Add" width="20" />}
            onClick={onNovoChat}
            sx={{
                width: 180,
                height: "40px", 
                whiteSpace: "nowrap", 
                color: "black",
                borderColor: "black",
                borderRadius: "10px",
                textTransform: "none",
                "&:hover": { borderColor: "black", backgroundColor: "transparent" },
            }}
            >
          Novo chat
        </Button>
      );
    }
    if (location.pathname === "/listagemMotos") {
      return (
        <Button
        variant="outlined"
        startIcon={<img src="/images/add.png" alt="Add" width="20" />}
        onClick={handleCadastroMoto}
        sx={{
            width: 250, 
            height: "40px",
            whiteSpace: "nowrap", 
            color: "black",
            borderColor: "black",
            borderRadius: "10px",
            textTransform: "none",
            fontSize: "18px",
            "&:hover": { borderColor: "black", backgroundColor: "transparent" },
        }}
        >
          Adicionar moto
        </Button>
      );
    }
    if (location.pathname === "/usuarios") {
      return (
        <Button
            variant="outlined"
            startIcon={<img src="/images/add.png" alt="Add" width="20" />}
            onClick={handleCadastroUsuario}
            sx={{
                width: 250, 
                height: "40px", 
                whiteSpace: "nowrap",
                color: "black",
                borderColor: "black",
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "18px",
                "&:hover": { borderColor: "black", backgroundColor: "transparent" },
            }}
            >
          Adicionar usuário
        </Button>
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 70,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: "20px",
        justifyContent: "space-between",
        px: 3,
        backgroundColor: "white",
        borderBottom: "1px solid #E0E0E0",
        boxSizing: "border-box",
        mb: 1,
      }}
    >
      {/* Perfil, nome e sobrenome */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              border: "1px solid black",
              display: "inline-flex",
              p: 1.5,
              borderRadius: "8px",
            }}
          >
            <img src="/images/person.png" alt="User" width="12" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Nome Sobrenome</Typography>
          </Box>
        </Box>
      </Box>

      {/* Notificações e novo chat*/}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          flex: 1,
          height: 54
        }}
      >
        {handlePaginaAtual()}

        <Box
          sx={{
            border: "1px solid black",
            display: "inline-flex",
            borderRadius: "10px",
          }}
        >
          <IconButton sx={{ color: "grey.700" }}>
            <img src="/images/bell.png" alt="Notifications" width="15" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default HeaderChatBot;
