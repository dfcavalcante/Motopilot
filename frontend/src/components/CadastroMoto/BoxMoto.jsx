import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const BoxMoto = ({ nomeMoto, numeroDeSerie, estado }) => {
  const navigate = useNavigate();

  {
    /* Função para navegar para a página de informações da moto */
  }
  const handleMotoInformacaoes = () => {
    navigate("/");
  };

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
        style={{
          width: "100%",
          height: "189px",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* A Box do estado atual da moto (ativa ou inativa) */}
      <Box
        sx={{
          position: "absolute",
          top: "12px", 
          right: "12px", 
          backgroundColor: "#D9D9D9",
          borderRadius: "12px",
          padding: "4px 12px", 
          boxShadow: 1, 
          width: 50,
          height: 8,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#000000", fontWeight: "bold" }}
        >
          {estado}
        </Typography>
      </Box>

      {/* Conteúdo de Texto e Botão */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        {/* Removi o {estado} daqui pois ele já está na imagem agora */}

        <Typography variant="h6" mb={2}>
          {" "}
          {nomeMoto}{" "}
        </Typography>
        <Typography variant="body2" mb={1} sx={{ color: "#484848" }}>
          {" "}
          Nº Série: {numeroDeSerie}{" "}
        </Typography>

        <Button
          variant="contained"
          onClick={handleMotoInformacaoes}
          sx={{
            backgroundColor: "#D9D9D9",
            color: "black",
            width: "200px",
            height: "40px",
            borderRadius: "16px",
            mt: 1,
            textTransform: "none",
            alignSelf: "center",
          }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default BoxMoto;
