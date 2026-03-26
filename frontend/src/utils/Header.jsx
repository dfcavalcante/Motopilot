import { Box, Typography, Button, IconButton, Avatar } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificacaoContext } from '../context/NotificacoesContext.jsx';
import { useLogin } from '../context/LoginContext.jsx';

import { getUserInitials, getAvatarColor } from '../utils/avatarUtils';

// Pequena Header em cima do Chatbot, tem os ícones, nome e novo chat
const Header = ({ onNovoChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notificacoes, listarNotificacoes } = useContext(NotificacaoContext);
  const { user } = useLogin();

  const iniciais = getUserInitials(user?.nome, user?.email);
  const corAvatar = getAvatarColor(user?.nome, user?.email);

  useEffect(() => {
    listarNotificacoes();
  }, [listarNotificacoes]);

  const temNotificacaoNaoLida = (notificacoes || []).some((notificacao) => !notificacao.lido);

  const nomeCompleto = (user?.nome || '').trim();
  const nomeExibicao = nomeCompleto || user?.email || 'Usuário';

  const handleCadastroMoto = (e) => {
    e.preventDefault();
    navigate('/cadastroMoto');
  };

  const handleCadastroMotoPai = (e) => {
    e.preventDefault();
    navigate('/cadastroMotoAtribuir');
  };

  const handleCadastroUsuario = async (e) => {
    e.preventDefault();
    navigate('/cadastro');
  };

  const handlePaginaAtual = () => {
    if (location.pathname === '/chatbot') {
      return (
        <Button
          startIcon={<img src="/images/add.png" alt="Add" width="20" color="white" />}
          onClick={onNovoChat}
          sx={{
            width: 180,
            height: '40px',
            whiteSpace: 'nowrap',
            backgroundColor: '#F30000',
            borderColor: '#F30000',
            color: 'white',
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: '18px',
            '&:hover': { borderColor: '#F30000', backgroundColor: '#F30000', color: 'white' },
          }}
        >
          Novo chat
        </Button>
      );
    }
    if (location.pathname === '/listagemMotos') {
      return (
        <Button
          startIcon={<img src="/images/add.png" alt="Add" width="20" />}
          onClick={handleCadastroMotoPai}
          sx={{
            width: 250,
            height: '40px',
            whiteSpace: 'nowrap',
            backgroundColor: '#F30000',
            borderColor: '#F30000',
            color: 'white',
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: '18px',
            '&:hover': { borderColor: '#F30000', backgroundColor: '#F30000', color: 'white' },
          }}
        >
          Adicionar modelo
        </Button>
      );
    }

    if (
      location.pathname === '/cadastroMoto' ||
      /^\/modeloMoto\/\d+\/motos$/.test(location.pathname)
    ) {
      return (
        <Button
          startIcon={<img src="/images/add.png" alt="Add" width="20" />}
          onClick={handleCadastroMoto}
          sx={{
            width: 250,
            height: '40px',
            whiteSpace: 'nowrap',
            backgroundColor: '#F30000',
            borderColor: '#F30000',
            color: 'white',
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: '18px',
            '&:hover': { borderColor: '#F30000', backgroundColor: '#F30000', color: 'white' },
          }}
        >
          Cadastrar moto
        </Button>
      );
    }
    if (location.pathname === '/motos-atribuir' || location.pathname === '/cadastro-atribuir') {
      return (
        <Button
          startIcon={<img src="/images/add.png" alt="Add" width="20" />}
          onClick={handleCadastroMoto}
          sx={{
            width: 250,
            height: '40px',
            whiteSpace: 'nowrap',
            backgroundColor: '#F30000',
            borderColor: '#F30000',
            borderRadius: '10px',
            color: 'white',
            textTransform: 'none',
            fontSize: '18px',
            '&:hover': { borderColor: '#F30000', backgroundColor: '#F30000', color: 'white' },
          }}
        >
          Adicionar moto
        </Button>
      );
    }
    if (location.pathname === '/usuarios' || location.pathname === '/cadastro') {
      return (
        <Button
          startIcon={<img src="/images/add.png" alt="Add" width="20" />}
          onClick={handleCadastroUsuario}
          sx={{
            width: 250,
            height: '40px',
            whiteSpace: 'nowrap',
            backgroundColor: '#F30000',
            borderColor: '#F30000',
            borderRadius: '10px',
            color: 'white',
            textTransform: 'none',
            fontSize: '18px',
            '&:hover': { borderColor: '#F30000', backgroundColor: '#F30000', color: 'white' },
          }}
        >
          Adicionar usuário
        </Button>
      );
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '20px',
        justifyContent: 'space-between',
        px: 3,
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        boxSizing: 'border-box',
        boxShadow: 6,
        mb: 1,
      }}
    >
      {/* Perfil, nome e sobrenome */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              backgroundColor: corAvatar,
              border: '1 px corAvatar solid',
              color: 'white', 
            }}
          >
            {iniciais}
          </Avatar>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>{nomeExibicao}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Notificações e novo chat*/}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 2,
          flex: 1,
          height: 54,
        }}
      >
        {handlePaginaAtual()}

        <Box
          sx={{
            boxShadow: 1,
            display: 'inline-flex',
            borderRadius: '10px',
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <IconButton sx={{ color: 'grey.700' }} onClick={() => navigate('/notificacoes')}>
            <img src="/images/bell.png" alt="Notifications" width="16" />
          </IconButton>
          {temNotificacaoNaoLida && (
            <Box
              sx={{
                position: 'absolute',
                top: 6,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#FF3B30',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
