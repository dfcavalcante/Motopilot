import React from "react";
import { Box, Stack, Divider, Typography } from "@mui/material";
import SideBar from "../components/SideBar";
import HeaderChatBot from "../components/ChatBot/HeaderChatbot";
import BarraPesquisa from "../components/CadastroMoto/BarraPesquisa";
import InformacoesUsuario from "../components/Usuários/InformacoesUsuario";

const Usuarios = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: "#989898", p: '16px', boxSizing: 'border-box' }}>
      
      <SideBar />

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}>
        <Stack spacing="8px" sx={{ height: '100%' }}>
          
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          <Box sx={{ flexGrow: 1, bgcolor: "white", borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, overflow: 'hidden' }}>
            <Box display={"flex"} mb={2} alignItems="center" gap={2}>
              <img src="/images/users.png" alt="Usuários" width="25" height={25} />
              <Typography fontSize={30}> Usuários</Typography>
            </Box>
            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px'}} />

            {/* Box da barra de pesquisa */}
            <Box
  display="flex"
  alignItems="center"
  gap={2}
  mb={2}
>
  {/* Visualização */}
  <Box display="flex" alignItems="center" gap={1}>
    <Typography>Visualização</Typography>
    <img src="/images/Organizar1.png" alt="Organizar 1" height={16} />
    <img src="/images/Organizar2.png" alt="Organizar 2" height={16} />
  </Box>

  {/* Barra de pesquisa (meio grande) */}
  <Box flex={1}>
    <BarraPesquisa />
  </Box>

  {/* Ordenar */}
  <Box display="flex" alignItems="center" gap={1}>
    <Typography>Ordenar</Typography>
    <img
      src="/images/linhaPraBaixo.png"
      alt="Seta para baixo"
      width={10}
      height={10}
    />
  </Box>
</Box>


            {/* Box das informações do usuário */}
            <Box
              backgroundColor="#DBDBDB"
              sx={{
                flexGrow: 100,
                width: "100%",
                borderRadius: "16px",
                p: 2,
                mt: 2,
                overflowY: "auto",
              }}
            >
              <InformacoesUsuario 
                nome={"João da Silva"}
                cargo={"Administrador"}
                email={"nome_sobrenome@gmail.com"}
              />

            </Box>
            
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default Usuarios;