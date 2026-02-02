import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const BoxMoto = ({nomeMoto, numeroDeSerie, estado}) => {
    const navigate = useNavigate();

    {/* Função para navegar para a página de informações da moto */}
    const handleMotoInformacaoes = () => {
        navigate('/');
    }

    return (
        <Box sx={{
            border: '2px solid grey',
            borderRadius: '16px',
            p: '16px',
            height: '370px',
            width: '336px',
            backgroundColor: '#AEAEAE',
        }}>
            {/*Aqui vai ser a imagem da moto*/}
            <img src="images/Motopilot Logo.png" alt="Logo Motopilot" style={{ width: '330px', height: '189px' }} />

            <Box>
                <Typography variant="body2" sx={{ color: '#000000' }}> {estado} </Typography>
            </Box>

            <Typography variant="h6" mb={2}> {nomeMoto} </Typography>
            <Typography variant="body2" mb={1} sx={{ color: '#484848' }}> Nº Série: {numeroDeSerie} </Typography>

            <Button variant="contained"
                onClick={handleMotoInformacaoes}
                sx={{
                    backgroundColor: '#D9D9D9',
                    color: 'black',
                    width: '200px',
                    height: '40px',
                    borderRadius: '16px',
                    mt: 2,
                    textTransform: 'none',
                    ml: 8
                }}>
                Entrar
            </Button>
        </Box>
    );
}

export default BoxMoto;