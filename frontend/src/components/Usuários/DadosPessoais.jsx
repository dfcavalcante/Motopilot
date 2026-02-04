import React, {useState} from "react";
import { Box,  Stack, Divider, Typography, RadioGroup, TextField, FormControlLabel, Button, Radio, InputLabel} from "@mui/material";

const DadosPessoais = ({nomeCompleto, setNomeCompleto, email, setEmail, numeroMatricula, setNumeroMatricula, funcao, setFuncao, etapa}) => {
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !nomeCompleto || !numeroMatricula || !funcao) {
      setError(true);
      return;
    } else {
      setError(false);
    }
  };
    
    
  return (
    <Box backgroundColor="#DBDBDB" width={500} borderRadius="16px" p={4} mt={2} display="flex" flexDirection="column" alignItems="center">
        <Typography mb={2} fontSize={24}> Dados Pessoais </Typography>
        <InputLabel sx={{ color: 'black', fontSize: 16, width: "100%", mb: 1,}}>
            Nome Completo
        </InputLabel>

        <TextField 
        variant="outlined" 
        fullWidth 
        size="small"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        error={error}
        placeholder={error ? "Campo Obrigatório *" : ""}
        sx={{ 
            mb: 2,
            "& .MuiOutlinedInput-root": {borderRadius: "16px",
            },
          "& .MuiOutlinedInput-input::placeholder": {
            color: error ? "#FF0000" : "inherit", //Vermelho que tá no protótipo
            opacity: error ? 0.8 : 0.5, // Garante que o vermelho fique nítido (browsers aplicam transparência por padrão)
            fontSize: 14
          }
        }} 
        />

        <InputLabel sx={{ color: 'black', fontSize: 16,  width: "100%", mb: 1}}>
          Email
        </InputLabel>

        <TextField 
        variant="outlined" 
        fullWidth 
        size="small"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        placeholder={error ? "Campo Obrigatório *" : ""}
        sx={{ 
            mb: 2,
            "& .MuiOutlinedInput-root": {borderRadius: "16px",
            },
          "& .MuiOutlinedInput-input::placeholder": {
            color: error ? "#FF0000" : "inherit", //Vermelho que tá no protótipo
            fontSize: 14,
            opacity: error ? 0.8 : 0.5, // Garante que o vermelho fique nítido (browsers aplicam transparência por padrão)
          }
        }} 
        />

        <InputLabel sx={{ color: 'black', fontSize: 16, width: "100%", mb: 1}}>
            Número de Matrícula
        </InputLabel>

        <TextField 
        variant="outlined" 
        fullWidth 
        size="small"
        value={numeroMatricula}
        error={error}
        onChange={(e) => setNumeroMatricula(e.target.value)}
        placeholder={error ? "Campo Obrigatório *" : ""}
        sx={{ 
            mb: 2,
            "& .MuiOutlinedInput-root": {borderRadius: "16px",
            },
          "& .MuiOutlinedInput-input::placeholder": {
            color: error ? "#FF0000" : "inherit", //Vermelho que tá no protótipo
            fontSize: 14,
            opacity: error ? 0.8 : 0.5, // Garante que o vermelho fique nítido (browsers aplicam transparência por padrão)
          }
        }} 
        />

        <InputLabel sx={{ color: 'black', fontSize: 16, mb: 1, width: "100%"}}>
            Função
        </InputLabel>
        <RadioGroup row sx={{ mb: 2, gap: 2 }}>
            <FormControlLabel value="admin" control={<Radio />} label="Administrador" />
            <FormControlLabel value="tecnico" control={<Radio />} label="Técnico" />
        </RadioGroup>

        <Box display="flex" gap={2}>
            <Button variant="contained" sx={{ backgroundColor: "#DBDBDB", color: "black" }}>Cancelar </Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#676767", color: "white", width: 226.43, height: 35}}>Próximo</Button>
        </Box>
    </Box>
    )
}

export default DadosPessoais;