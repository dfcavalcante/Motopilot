import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const EtapasMotoIndividual = ({ etapa }) => {
  // Função para definir a opacidade: 1 se for a etapa atual ou já concluída, 0.4 se for futura
  const getOpacity = (stepNumber) => {
    if (etapa === stepNumber) {
      return 1;
    }
    else if(etapa > stepNumber){
      return 1;
    }else if(etapa < stepNumber){
      return 0.4;
    }
  };

  // Função auxiliar para renderizar o ícone
  const renderIcone = (numeroEtapa) => {
    // Se a etapa já foi concluída (é menor que a atual), mostra o check verde
    if (etapa > numeroEtapa) {
      return <CheckCircleIcon sx={{ fontSize: 18, color: "#216A13", mr: 1 }} />;
    }

    // Se for a etapa ATUAL, mostra uma bolinha azul (ou cor de destaque)
    if (etapa === numeroEtapa) {
      return (
        <CheckCircleIcon
          sx={{
            fontSize: 18, // Tamanho próximo ao das bolinhas
            color: "#216A13",
            mr: 1,
          }}
        />
      );
    }

    // Se for etapa futura, bolinha cinza
    return (
      <Box
        width={12}
        height={12}
        borderRadius="50%"
        backgroundColor="#898989"
        mr={1}
      />
    );
  };

  return (
    <Box display="flex" alignItems="center" mb={2} justifyContent="center" >
      {/* --- ETAPA 1 --- */}
      <Box
        display="flex"
        alignItems="center"
      >
        {renderIcone(1)}
        <Typography
          sx={{
            fontWeight: etapa === 1 ? "normal" : "normal",
            color: etapa === 1 ? "#000" : "#000000",
          }}
        >
          01 Dados Gerais
        </Typography>
      </Box>

      {/* Linha 1 (Fica entre as etapas, não precisa de opacidade, mas pode ter cor) */}
      <Box
        width={60}
        height={2}
        backgroundColor={etapa > 1 ? "#a0a0a0" : "#E0E0E0"}
        mx={2}
      />


      {/* --- ETAPA 3 --- */}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          opacity: getOpacity(3),
          transition: "opacity 0.3s ease",
        }}
      >
        {renderIcone(2)}
        <Typography
          sx={{
            fontWeight: etapa === 2 ? "normal" : "normal",
            color: etapa === 2 ? "#000000" : "#000000",
          }}
        >
          02 Concluído
        </Typography>
      </Box>
    </Box>
  );
};

export default EtapasMotoIndividual;
