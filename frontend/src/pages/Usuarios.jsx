import React from 'react';
import { Box, Typography } from '@mui/material';
import BaseFront from '../utils/BaseFront';
import InformacoesUsuario from '../components/Usuários/InformacoesUsuario';
import UserRow from '../components/Usuários/ListUsers';
import TableHeader from '../components/Usuários/TableHeader';
import UpdateUsuario from '../components/Usuários/UpdateUsuario';
import { HookUsers } from '../hooks/HookUsers';
import { Toolbar } from '../components/Usuários/ToolBar';

const Usuarios = () => {
  const {
    viewMode,
    setViewMode,
    input,
    setInput,
    anchorEl,
    openMenu,
    atualizando,
    setAtualizando,
    handleClickOrdernar,
    handleCloseMenu,
    handleSelectOrder,
    usersProcessados,
    handleEditUser,
    excluirUser,
  } = HookUsers();

  return (
    <BaseFront icone="/images/users.png" width="30" height={25} nome={'Usuários'}>
      {/* --- Header de Controles --- */}
      <Toolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        input={input}
        setInput={setInput}
        anchorEl={anchorEl}
        openMenu={openMenu}
        handleClickOrdernar={handleClickOrdernar}
        handleCloseMenu={handleCloseMenu}
        handleSelectOrder={handleSelectOrder}
      />

      {/* --- Modal de Edição --- */}
      {atualizando && (
        <UpdateUsuario
          open={!!atualizando}
          onClose={() => setAtualizando(null)}
          onSave={handleEditUser}
          initialData={atualizando}
        />
      )}

      {/* --- Área da Listagem --- */}
      <Box
        backgroundColor="#ffffff"
        sx={{
          flexGrow: 100,
          width: '100%',
          borderRadius: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          mt: 2,
          ...(viewMode === 'grid'
            ? {
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3,
                p: 3,
                justifyItems: 'center',
                alignContent: 'flex-start',
              }
            : {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                paddingLeft: { xs: 2, sm: 3, md: 5 },
                paddingRight: { xs: 1, sm: 2, md: 3 },
                gap: 1,
              }),
        }}
      >
        {viewMode === 'list' && <TableHeader />}

        {(usersProcessados || []).map((usuario) => (
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

        {(!usersProcessados || usersProcessados.length === 0) && (
          <Typography align="center" sx={{ mt: 2 }}>
            Nenhum usuário encontrado.
          </Typography>
        )}
      </Box>
    </BaseFront>
  );
};

export default Usuarios;
