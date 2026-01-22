import { Box, Typography } from "@mui/material";
import React from "react";

const SugestaoChatbot = ({ sugestao, onClick }) => {
    return (
        <Box 
            onClick={() => onClick && onClick(sugestao)}
            sx={{
                backgroundColor: "#D9D9D9",
                borderRadius: "16px",
                width: '320px', 
                height: 40,   
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                px: 2,
                textAlign: 'center',
                '&:hover': { backgroundColor: '#ccc' } 
            }}
        >
            <Typography
            variant="body1"
            sx={{color: '#000000'}}
            > 
                {sugestao} 
            </Typography>
        </Box>
    )
};

export default SugestaoChatbot;