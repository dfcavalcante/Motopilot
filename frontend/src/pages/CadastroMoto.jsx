import React, { useState, useContext } from "react";
import { Box, Stack, Typography, Divider, Button } from "@mui/material";
import HeaderChatBot from "../components/ChatBot/HeaderChatbot.jsx";
import SideBar from "../components/SideBar.jsx";
import EtapasMoto from "../components/Motos/EtapasMoto.jsx";
import { MotoContext } from "../context/MotoContext.jsx";

import DadosGerais from "../components/Motos/DadosGerais.jsx";
import ManualMoto from "../components/Usuários/DadosManual.jsx";
// import Conclusao from "../components/Motos/Conclusao.jsx";   // Criar este arquivo

const CadastroDeMoto = () => {
  const { cadastrarMoto } = useContext(MotoContext);

  const [etapaAtual, setEtapaAtual] = useState(1);

  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [marca, setMarca] = useState("");
  const [ano, setAno] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState(null);

  const handleProximo = () => {
    setEtapaAtual((prev) => prev + 1);
  };

  const handleVoltar = () => {
    setEtapaAtual((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Função final de envio (só acontece na última etapa)
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("modelo", modelo);
    formData.append("numero_serie", numeroSerie);
    formData.append("marca", marca);
    formData.append("ano", ano);
    formData.append("descricao", descricao);
    formData.append("foto", foto); // Ajuste conforme seu backend espera

    const sucesso = await cadastrarMoto(formData);
    if (sucesso) {
      alert("Moto cadastrada com sucesso!");
      setEtapaAtual(3); // Vai para tela de sucesso
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#989898",
        p: "16px",
        boxSizing: "border-box",
      }}
    >
      <SideBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          ml: "24px",
          height: "100%",
        }}
      >
        <Stack spacing="8px" sx={{ height: "100%" }}>
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "white",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              overflow: "hidden",
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Adicionar Moto
            </Typography>
            <Divider
              sx={{ width: "90%", bgcolor: "grey.500", height: "0.4px", mb: 2 }}
            />

            <EtapasMoto etapa={etapaAtual} />

            <Box sx={{ width: "100%", flex: 1, overflowY: "auto" }}>
              {etapaAtual === 1 && (
                <DadosGerais
                  setModelo={setModelo}
                  setNumeroSerie={setNumeroSerie}
                  setMarca={setMarca}
                  setAno={setAno}
                  setDescricao={setDescricao}
                  setFoto={setFoto}
                  // Passamos a função de ir para o próximo
                  onNext={handleProximo}
                />
              )}

              {etapaAtual === 2 && <ManualMoto
              onBack={handleVoltar}
              onNext={handleProximo}
              />}

              {etapaAtual === 3 && (
                /* Aqui entra a tela de Sucesso/Conclusão */
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h4" color="green">
                    Cadastro Concluído!
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CadastroDeMoto;
