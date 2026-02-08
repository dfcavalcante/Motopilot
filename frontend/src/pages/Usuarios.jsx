import React from 'react';
import { Box, Stack, Divider, Typography, IconButton } from '@mui/material';
import SideBar from '../components/SideBar';
import HeaderChatBot from '../components/ChatBot/HeaderChatbot';
import BarraPesquisa from '../components/CadastroMoto/BarraPesquisa';
import InformacoesUsuario from '../components/Usuários/InformacoesUsuario';

const Usuarios = () => {
  const [input, setInput] = React.useState('');

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#989898',
        p: '16px',
        boxSizing: 'border-box',
      }}
    >
      <SideBar />

      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}
      >
        <Stack spacing="8px" sx={{ height: '100%' }}>
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              bgcolor: 'white',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              overflow: 'hidden',
            }}
          >
            <Box display={'flex'} mb={2} alignItems="center" gap={2}>
              <img src="/images/users.png" alt="Usuários" width="30" height={25} />
              <Typography fontSize={30}> Usuários</Typography>
            </Box>
            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px' }} />

            {/*/* Box dos filtros e barra de pesquisa */}
            <Box display="flex" alignItems="center" mb={2} sx={{ width: '100%', px: 2 }}>
              <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
                {/*Visualizar*/}
                <Box display="flex" alignItems="center" gap={1} ml={9}>
                  <Typography sx={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                    Visualização
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    {/* Botão 1 */}
                    <IconButton
                      onClick={() => console.log('Visualização 1')}
                      sx={{
                        border: '1px solid #E0E0E0',
                        borderRadius: '4px', 
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <img src="/images/Organizar1.png" alt="Organizar 1" height={14} />
                    </IconButton>

                    {/* Botão 2 */}
                    <IconButton
                      onClick={() => console.log('Visualização 2')}
                      sx={{
                        border: '1px solid #a5a5a5',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <img src="/images/Organizar2.png" alt="Organizar 2" height={14} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Ordenar */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={{ fontWeight: '500', color: 'grey.900' }}>Ordenar</Typography>
                  <IconButton
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '4px',
                      border: '1px solid #E0E0E0',
                      backgroundColor: 'white',
                    }}
                  >
                    <img src="/images/linhaPraBaixo.png" alt="Ordenar" style={{ width: '10px' }} />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ width: '500px' }}>
                <BarraPesquisa input={input} setInput={setInput} />
              </Box>

              <Box sx={{ flex: 1 }} />
            </Box>

            {/* Box das informações do usuário */}
            <Box
              backgroundColor="#DBDBDB"
              sx={{
                flexGrow: 100,
                width: '100%',
                borderRadius: '16px',
                pl: 16,
                mt: 2,
                overflowY: 'auto',
              }}
            >
              <InformacoesUsuario
                nome={'João da Silva'}
                cargo={'Administrador'}
                email={'nome_sobrenome@gmail.com'}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Usuarios;
