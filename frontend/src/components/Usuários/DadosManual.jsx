import React, { useState, useCallback } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto"; // Ícone similar ao da imagem

const ManualMoto = ({ onBack, onNext }) => {
  const [arquivo, setArquivo] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      setArquivo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png"],
    }, // Aceita PDF e imagens
    maxFiles: 1,
  });

  return (
    <Box
      sx={{
        backgroundColor: "#E0E0E0",
        p: 4,
        borderRadius: "12px",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Roboto, sans-serif",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onBack}
          sx={{ position: "absolute", left: 0, color: "#666" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h5"
          align="center"
          sx={{ flexGrow: 1, color: "#333", fontWeight: 500 }}
        >
          Manual da Moto
        </Typography>
      </Box>

      <Box
        {...getRootProps()}
        sx={{
          border: "1px solid #A0A0A0",
          borderRadius: "12px",
          minHeight: 300,
          minWidth: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#d0d0d0" : "rgba(0, 0, 0, 0.03)",
          transition: "all .2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            borderColor: "#666",
          },
          p: 3,
        }}
      >
        <input {...getInputProps()} />

        {arquivo ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <InsertPhotoIcon sx={{ fontSize: 60, color: "#666" }} />
            <Typography variant="body1" sx={{ color: "#333", fontWeight: 500 }}>
              Arquivo selecionado:
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              {arquivo.name}
            </Typography>
            <Button
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                setArquivo(null);
              }}
              sx={{
                mt: 2,
                borderRadius: "20px",
                borderColor: "#666",
                color: "#666",
              }}
            >
              Remover Arquivo
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <img src="/images/Imagem.png" alt="Upload" width={80} height={60} />
            <Typography
              variant="body2"
              sx={{ color: "#333", fontSize: "1rem" }}
            >
              {isDragActive ? "Solte o arquivo aqui" : "Arraste arquivo aqui"}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#666",
                color: "white",
                padding: "10px 24px",
                borderRadius: "50px",
                fontSize: "0.85rem",
                fontWeight: 500,
                mt: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Procurar neste Dispositivo
            </Box>
          </Box>
        )}
      </Box>

      {/* Rodapé com Botões Cancelar e Próximo */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            color: "#333",
            borderColor: "#999",
            borderRadius: "8px",
            textTransform: "none",
            px: 4,
            height: "40px",
            "&:hover": {
              borderColor: "#666",
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!arquivo} // Desabilita se não houver arquivo
          sx={{
            backgroundColor: "#666", // Cor de fundo cinza escuro
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            px: 4,
            height: "40px",
            "&:hover": { backgroundColor: "#444" },
            "&.Mui-disabled": { backgroundColor: "#999", color: "#ccc" }, // Estilo quando desabilitado
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default ManualMoto;
