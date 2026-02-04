import { Box, Button, Typography, IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BoxMoto = ({ nomeMoto, numeroDeSerie, estado, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        border: "2px solid #AEAEAE",
        borderRadius: "16px",
        height: "340px",
        width: "336px",
        backgroundColor: "#AEAEAE",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Imagem de Fundo */}
      <img
        src="images/Motopilot Logo.png"
        alt="Logo Motopilot"
        style={{ width: "100%", height: "189px", objectFit: "cover", display: "block" }}
      />

      {/* Botões de Ação isolados com zIndex e stopPropagation */}
      <Box sx={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: 1, zIndex: 2 }}>
        <IconButton 
          onClick={(e) => { e.stopPropagation(); onEdit(); }} 
          size="small" 
          sx={{ bgcolor: "rgba(255,255,255,0.9)", '&:hover': { bgcolor: "white" }, boxShadow: 2 }}
        >
          <EditIcon fontSize="small" color="primary" />
        </IconButton>
        <IconButton 
          onClick={(e) => { e.stopPropagation(); onDelete(); }} 
          size="small" 
          sx={{ bgcolor: "rgba(255,255,255,0.9)", '&:hover': { bgcolor: "white" }, boxShadow: 2 }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      </Box>

      {/* Badge de Estado */}
      <Box sx={{ position: "absolute", top: "12px", right: "12px", bgcolor: "#D9D9D9", borderRadius: "12px", px: 2, py: 0.5, boxShadow: 1 }}>
        <Typography variant="caption" sx={{ color: "black", fontWeight: "bold" }}>
          {estado || "Ativa"}
        </Typography>
      </Box>

      {/* Conteúdo inferior */}
      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" noWrap>{nomeMoto}</Typography>
          <Typography variant="body2" color="#484848">Nº Série: {numeroDeSerie}</Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            bgcolor: "#D9D9D9", color: "black", width: "80%", borderRadius: "16px",
            textTransform: "none", alignSelf: "center", fontWeight: "bold",
            '&:hover': { bgcolor: "#c4c4c4" }
          }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default BoxMoto;