import React from "react";
import { Box, Typography } from "@mui/material";

const Etapas = ({etapa}) => {
    return (
    <Box display="flex" alignItems="center" mb={2}>
    {/* Etapa 1 */}
    <Box display="flex" alignItems="center">
        <Box
        width={12}
        height={12}
        borderRadius="50%"
        backgroundColor="#B2B2B2"
        mr={1}
        />
        <Typography>01 Dados Gerais</Typography>
    </Box>

    {/* Linha */}
    <Box
        width={40}
        height={2}
        backgroundColor="#B2B2B2"
        mx={2}
    />

    {/* Etapa 2 */}
    <Box display="flex" alignItems="center">
        <Box
        width={12}
        height={12}
        borderRadius="50%"
        backgroundColor="#B2B2B2"
        mr={1}
        />
        <Typography>02 Criar Senha</Typography>
    </Box>

    {/* Linha */}
    <Box
        width={40}
        height={2}
        backgroundColor="#B2B2B2"
        mx={2}
    />

    {/* Etapa 3 */}
    <Box display="flex" alignItems="center">
        <Box
        width={12}
        height={12}
        borderRadius="50%"
        backgroundColor="#B2B2B2"
        mr={1}
        />
        <Typography>03 Concluído</Typography>
    </Box>
    </Box>

    )
}

export default Etapas;