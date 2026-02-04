import React, {useState}from "react";
import { Box,  Stack, Divider, Typography, RadioGroup, TextField, FormControlLabel, Button, Radio, InputLabel} from "@mui/material";
import SideBar from "../components/SideBar";
import HeaderChatBot from "../components/ChatBot/HeaderChatbot";
import DadosPessoais from "../components/Usuários/DadosPessoais";
import Etapas from "../components/Usuários/Etapas";

const Cadastro = () => {
  const [nomeCompleto, setNomeCompleto] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [numeroMatricula, setNumeroMatricula] = React.useState("");
  const [funcao, setFuncao] = React.useState("");

  const [etapa, setEtapa] = React.useState(1); // Estado para controlar a etapa do cadastro

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: "#989898", p: '16px', boxSizing: 'border-box' }}>
      <SideBar />

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}>
        <Stack spacing="8px" sx={{ height: '100%' }}>
          
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box> 

          <Box sx={{ flexGrow: 1, bgcolor: "white", borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, overflow: 'hidden' }}>
            <Typography mb={2} fontSize={30}> Adicionar Usuário </Typography>
            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px', mb: 2}} />

            {/* Box das etapas */}
            <Etapas etapa={etapa}/>

            {/* Box do cadastro de usuário */}
            <DadosPessoais 
                nomeCompleto={nomeCompleto}
                setNomeCompleto={setNomeCompleto} 

                email={email}
                setEmail={setEmail}

                numeroMatricula={numeroMatricula}
                setNumeroMatricula={setNumeroMatricula}

                funcao={funcao}
                setFuncao={setFuncao}

                etapa={etapa}/>

          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default Cadastro;