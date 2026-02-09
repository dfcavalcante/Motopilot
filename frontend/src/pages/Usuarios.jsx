import React, { useMemo, useState } from 'react';
import { Box, Stack, Divider, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SideBar from '../components/SideBar';
import HeaderChatBot from '../components/ChatBot/HeaderChatbot';
import BarraPesquisa from '../components/CadastroMoto/BarraPesquisa';
import InformacoesUsuario from '../components/Usuários/InformacoesUsuario';
import { UsersContext } from '../context/UserContext';
import UserRow from '../components/Usuários/ListUsers';

const Usuarios = () => {
  const { listarUsers, users, excluirUser } = React.useContext(UsersContext);

  const [tipoOrdenacao, setTipoOrdenacao] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const [anchorEl, setAnchorEl] = useState(null);

  const [input, setInput] = React.useState('');

  React.useEffect(() => {
    listarUsers();
  }, []);

  // Controles do Menu
  const openMenu = Boolean(anchorEl);
  const handleClickOrdernar = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleSelectOrder = (tipo) => {
    setTipoOrdenacao(tipo);
    handleCloseMenu();
  };

  // Filtro e ordenação dos usuários
  const usersProcessados = useMemo(() => {
    let lista = [...users];

    if (input) {
      lista = lista.filter((user) => user.nome?.toLowerCase().includes(input.toLowerCase()));
    }
    if (tipoOrdenacao === 'AZ') {
      lista.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    } else if (tipoOrdenacao === 'ZA') {
      lista.sort((a, b) => (b.nome || '').localeCompare(a.nome || ''));
    }

    return lista;
  }, [users, input, tipoOrdenacao]);

  const handleEditUser = (usuario) => {
    console.log('Editando usuário:', usuario);
  };

  const TableHeader = () => (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        mt: 3,
        mb: 2,
        borderBottom: '1px dashed #969696',
        pb: 2, 
      }}
    >
      <Box sx={{ width: '25%' }}>
        <Typography color="black">Funcionário</Typography>
      </Box>

      <Box sx={{ width: '25%' }}>
        <Typography color="black">Email</Typography>
      </Box>

      <Box sx={{ width: '20%' }}>
        <Typography color="black">Função</Typography>
      </Box>

      <Box sx={{ width: '20%', textAlign: 'center' }}>
        <Typography color="black">Status</Typography>
      </Box>

      <Box sx={{ width: '3.5%', textAlign: 'right' }}>
        <Typography color="black">Ações</Typography>
      </Box>
    </Box>
  );

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
              p: 2,
              overflow: 'hidden',
            }}
          >
            <Box display={'flex'} mb={2} alignItems="center" gap={2}>
              <img src="/images/users.png" alt="Usuários" width="30" height={25} />
              <Typography fontSize={30}> Usuários</Typography>
            </Box>
            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px' }} />

            {/* Box dos filtros e barra de pesquisa */}
            <Box display="flex" alignItems="center" mt={1} sx={{ width: '100%', px: 2 }}>
              <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
                <Box display="flex" alignItems="center" gap={1} ml={9}>
                  <Typography sx={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                    Visualização
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      onClick={() => setViewMode('grid')}
                      sx={{
                        border: '1px solid #E0E0E0',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      <img src="/images/Organizar1.png" alt="Organizar 1" height={14} />
                    </IconButton>
                    <IconButton
                      onClick={() => setViewMode('list')}
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

                {/* --- BOTÃO DE ORDENAR E MENU --- */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={{ fontWeight: '500', color: 'grey.900' }}>Ordenar</Typography>
                  <IconButton
                    onClick={handleClickOrdernar}
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

                  <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
                    <MenuItem onClick={() => handleSelectOrder('AZ')}>Ordenar A - Z</MenuItem>
                    <MenuItem onClick={() => handleSelectOrder('ZA')}>Ordenar Z - A</MenuItem>
                  </Menu>
                </Box>
              </Box>

              <Box sx={{ width: '580px' }}>
                <BarraPesquisa input={input} setInput={setInput} />
              </Box>
              <Box sx={{ flex: 1 }} />
            </Box>
            
            {/* Box principal que contém a listagem em si, seja em grid ou listagem */}
            <Box
              backgroundColor="#DBDBDB"
              sx={{
                flexGrow: 100,
                width: '100%',
                borderRadius: '16px',
                pl: 12,
                pr: 12,
                mt: 2,
                overflowY: 'auto',
                // quando estiver em modo grid usamos CSS Grid responsivo (1..4 colunas),
                // caso contrário mantemos o layout em coluna para a listagem
                ...(viewMode === 'grid'
                  ? {
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      },
                      alignItems:'flex-start',
                    }
                  : {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }),
               }}
            >

              {viewMode === 'list' && <TableHeader />}

              {usersProcessados.map((usuario) => (
                <React.Fragment key={usuario.id || usuario.matricula}>
                  {viewMode === 'list' ? (
                    <UserRow
                      usuario={usuario}
                      onEdit={handleEditUser} 
                      onDelete={excluirUser}
                    />
                  ) : (
                      <InformacoesUsuario
                        nome={usuario.nome}
                        cargo={usuario.funcao}
                        email={usuario.email}
                      />
                  )}
                </React.Fragment>
              ))}

              {usersProcessados.length === 0 && (
                <Typography align="center" sx={{ mt: 2 }}>
                  Nenhum usuário encontrado.
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Usuarios;
