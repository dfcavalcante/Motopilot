import React from "react";
import { Box,  Stack, Divider, Typography, RadioGroup, TextField, FormControlLabel, Button, Radio, InputLabel} from "@mui/material";

const InformacoesUsuario = ({nome, cargo, email}) => {
    return (
  <Box
    backgroundColor="#B2B2B2"
    width={435}
    height={135}
    borderRadius="16px"
    p={2}
    mt={2}
    display="flex"
    alignItems="center"
    gap={3}
  >
    {/* Ícone à esquerda */}
    <Box backgroundColor="white" borderRadius="50%" p={2}>
      <img
        src="/images/userIcon.png"
        alt="Ícone Usuário"
        width={20}
        height={20}
      />
    </Box>

    {/* Conteúdo à direita */}
    <Box flex={1}>
      <Typography fontSize={24} fontWeight={300}>{nome}</Typography>
      <Typography fontSize={20} mb={1} fontWeight={400}>{cargo}</Typography>

      {/* Email + ícones alinhados */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography fontSize={16} fontWeight={300}>{email}</Typography>

        <Box display="flex" gap={1}>
          <img
            src="/images/lapis.png"
            alt="Editar"
            width={16}
            height={16}
            style={{ cursor: "pointer" }}
          />
          <img
            src="/images/lixeira.png"
            alt="Excluir"
            width={16}
            height={16}
            style={{ cursor: "pointer"}}
          />
        </Box>
      </Box>
    </Box>
  </Box>
);

}

export default InformacoesUsuario;