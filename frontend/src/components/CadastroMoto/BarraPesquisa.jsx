import React from "react";
import { Box, TextField, InputAdornment  } from "@mui/material";

const BarraPesquisa = ({input, setInput, onSend}) => {
    return (
        <Box sx={{ width: '100%', maxWidth: 720, mt: 2, flexShrink: 0 }}>
        <TextField
            placeholder="Buscar"
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    "& fieldset": { borderRadius: "16px" },
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <img src="/images/search.png" alt="Search" width="15" />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                      <img src="/images/SendButton.png" alt="Send" width="15" style={{ cursor: 'pointer' }} onClick={onSend} />
                    </InputAdornment>
                ),
            }}
        />
    </Box>
    );
};

export default BarraPesquisa;