import { Box } from "@mui/material";
import React from "react";
import { useState } from "react";

const TextChatBot = ({pergunta}) => {
    const [pergunta, setPergunta] = useState(pergunta);
    const [resposta, setResposta] = useState('');

    const isPergunta = pergunta.length > 0;

    return (
        {!isPergunta && <Box
            sx={{
                width: '100%',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                px: 2,
                py: 1,
            }}
        >
            
        </Box>
        }
    );
}

export default TextChatBot;