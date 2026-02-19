import React, { useMemo, useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import BaseFront from '../utils/BaseFront';
import BarraPesquisa from '../components/CadastroMoto/BarraPesquisa';
import InformacoesUsuario from '../components/Usuários/InformacoesUsuario';
import { UsersContext } from '../context/UserContext';
import UserRow from '../components/Usuários/ListUsers';
import TableHeader from '../components/Usuários/TableHeader';
import UpdateUsuario from '../components/Usuários/UpdateUsuario';

const Usuarios = () => {
  const { listarUsers, users, excluirUser, atualizarUser } = React.useContext(UsersContext);

  const [tipoOrdenacao, setTipoOrdenacao] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const [anchorEl, setAnchorEl] = useState(null);
  const [atualizando, setAtualizando] = useState(null);
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

  const handleEditUser = async (novosDadosDoFormulario) => {
    if (atualizando) {
      await atualizarUser(atualizando.id, novosDadosDoFormulario);
      setAtualizando(null);
    }
  };

  return (
    <BaseFront icone="/images/users.png" width="30" height={25} nome={'Usuários'}>
      {/* Box dos filtros e barra de pesquisa */}
      <Box display="flex" alignItems="center" mt={1} sx={{ width: '100%', px: 2 }}>
        <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} ml={9}>
            <Typography sx={{ fontWeight: '500', whiteSpace: 'nowrap' }}>Visualização</Typography>
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

      {atualizando && (
        <UpdateUsuario
          open={!!atualizando}
          onClose={() => setAtualizando(null)}
          onSave={handleEditUser}
          initialData={atualizando}
        />
      )}

      {/* Box principal que contém a listagem em si, seja em grid ou listagem */}
      <Box
        backgroundColor="#DBDBDB"
        sx={{
          flexGrow: 100,
          width: '100%',
          borderRadius: '16px',
          pl: 16,
          pr: 16,
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
                alignItems: 'flex-start',
                alignContent: 'flex-start',
              }
            : {
                display: 'flex',
                flexDirection: 'column',
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
                setAtualizando={setAtualizando}
                atualizando={atualizando}
              />
            ) : (
              <InformacoesUsuario
                usuario={usuario}
                onEdit={handleEditUser}
                onDelete={excluirUser}
                setAtualizando={setAtualizando}
                atualizando={atualizando}
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
    </BaseFront>
  );
};

export default Usuarios;
