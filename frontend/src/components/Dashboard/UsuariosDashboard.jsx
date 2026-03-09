import React, { useContext, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { UsersContext } from '../../context/UserContext';

const BoxUsuario = ({ icone, nome, descricao }) => {
  return (
    <Box width={210} height={300} backgroundColor={'#ffffff'} borderRadius={4}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        gap={3}
        padding={2}
      >
        <Typography width={25} height={30}>
          {icone}
        </Typography>

        <Typography fontSize={15} variant="body-1">
          {nome}
        </Typography>

        <Typography fontSize={15} variant="body-2" color="#00000080">
          {descricao}
        </Typography>
      </Stack>
    </Box>
  );
};

{
  /*Componente do Dashboard para mostrar as peças defeituosas*/
}
const UsuariosDashboards = () => {
  const { users, listarUsers } = useContext(UsersContext);

  useEffect(() => {
    listarUsers();
  }, [listarUsers]);

  const usuariosVisiveis = users.slice(0, 4);

  return (
    <Box
      backgroundColor={'#D9D9D9'}
      width={730} //mesma largura da RelatoriosDashboard
      height={240}
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
      borderRadius={4}
    >
      <Typography variant="h5" marginBottom={2} marginTop={2}>
        Usuários
      </Typography>

      <Box justifyContent={'center'} display={'flex'} flexDirection={'row'} gap={2} marginTop={2}>
        {usuariosVisiveis.map((usuario) => (
          <BoxUsuario
            icone={usuario.icone || '👤'}
            nome={usuario.nome}
            descricao={usuario.funcao || usuario.email || ''}
            key={usuario.id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UsuariosDashboards;
