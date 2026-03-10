import React, { useContext, useEffect } from 'react';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { UsersContext } from '../../context/UserContext';

// Sub-componente para um único card de usuário
const BoxUsuario = ({ icone, nome, descricao }) => {
  return (
    <Box
      width={140}
      height={'90%'}
      backgroundColor={'#ffffff'}
      borderRadius={4}
      padding={2}
      display="flex"
      flexDirection="column"
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={1.5}
        height="100%"
        flex={1}
      >
        {/* Caixa cinza por trás do ícone do usuário (centralizado e redondo) */}
        <Box
          backgroundColor="#E0E0E0" 
          borderRadius="50%" // Torna o container redondo
          width={50}
          height={50}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden" 
          border="1px solid #DEDEDE" 
        >
          {/* Garante que o ícone se adapte ao tamanho da caixa cinza */}
          {icone && React.isValidElement(icone)
            ? React.cloneElement(icone, {
                style: {
                  ...icone.props.style,
                  maxWidth: '80%',
                  maxHeight: '80%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                },
              })
            : null}
        </Box>

        <Typography fontSize={13} textAlign="center" fontWeight="500">
          {nome}
        </Typography>

        <Typography fontSize={13} variant="body2" color="#00000080" textAlign="center">
          {descricao}
        </Typography>
      </Stack>
    </Box>
  );
};


/* Componente principal do Dashboard para listar os primeiros usuários reais */

const UsuariosDashboards = () => {
  const { users, listarUsers } = useContext(UsersContext);
  const navigate = useNavigate();

  useEffect(() => {
    listarUsers();
  }, [listarUsers]);

  // Pega apenas os 4 primeiros usuários
  const usuariosVisiveis = users.slice(0, 4);

  return (
    <Box
      position="relative"
      backgroundColor={'#D9D9D9'}
      width="100%"
      height="100%" 
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
      borderRadius={4}
      padding={2}
    >
      {/* Caixa cinza por trás do botão de seta */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
        }}
      >
        <IconButton
          sx={{ color: '#000000' }} 
          onClick={() => navigate('/usuarios')}
        >
          <img
            src="/images/setaDiagonal.png"
            alt={'Seta para usuários'}
            width={20}
            height={12}
            style={{ objectFit: 'contain' }}
          />
        </IconButton>
      </Box>

      <Typography variant="h5" marginBottom={2}>
        Usuários
      </Typography>

      <Box
        justifyContent={'center'}
        display={'flex'}
        flexDirection={'row'}
        flexWrap={'wrap'}
        gap={2}
        width="100%"
      >
        {usuariosVisiveis.map((usuario) => (
          <BoxUsuario
            icone={
              usuario.icone ? (
                <img src={usuario.icone} alt="Ícone do Usuário" />
              ) : (
                <img src={'/images/person.png'} alt="Ícone Padrão" />
              )
            }
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
