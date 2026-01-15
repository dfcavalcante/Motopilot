import { Box, Typography } from "@mui/material";
import React from "react";

const SugestaoChatbot = ({sugestao}) => {

    return(
        <Box 
            backgroundColor="grey.300"
            borderRadius={3}
            width={300}
            height={70}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            sx={{cursor: "pointer"}}
        >
            <Typography
            variant="body1"
            sx={{color: "grey.800"}}
            > 
                {sugestao} 
            </Typography>
        </Box>
    )
};

export default SugestaoChatbot;