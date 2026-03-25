import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useContext, useEffect } from 'react';
import BaseFront from '../utils/BaseFront';
import BoxNotificacao from '../components/Notificacoes/BoxNotificacao.jsx';
import { NotificacaoContext } from '../context/NotificacoesContext.jsx';
import { useNavigate } from 'react-router-dom';

const Notificacoes = () => {
  const { notificacoes, listarNotificacoes, marcarComoLida, marcarTodasComoLida } =
    useContext(NotificacaoContext);

  const navigate = useNavigate();

  useEffect(() => {
    listarNotificacoes();
  }, [listarNotificacoes]);

  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <BaseFront nome={'Notificações'}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 3, pr: 4 }}>
        <IconButton
          onClick={() => navigate('/dashboard')}
          sx={{
            position: 'absolute',
            left: 150,
            top: 150,
            padding: 1.5,
            backgroundColor: '#FFE4E4',
            '&:hover': {
              backgroundColor: '#fcd2d2',
            },
          }}
        >
          <img src="/images/X.png" alt="Excluir" width={12} height={12} />
        </IconButton>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => marcarTodasComoLida()}
          startIcon={<DoneAllIcon />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#ccc',
            color: '#333',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#999',
            },
          }}
        >
          Marcar todas como lidas
        </Button>
      </Box>
      <Box sx={{ width: '100%', overflowY: 'auto', pb: 2 }}>
        {(notificacoes || []).map((notificacao) => (
          <BoxNotificacao
            key={notificacao.id}
            check={notificacao.lido}
            titulo={notificacao.titulo}
            descricao={notificacao.mensagem}
            data={formatarData(notificacao.criado_em)}
            onToggleRead={() => marcarComoLida(notificacao.id)}
          />
        ))}

        {(!notificacoes || notificacoes.length === 0) && (
          <Typography align="center" sx={{ py: 3 }}>
            Nenhuma notificação encontrada.
          </Typography>
        )}
      </Box>
    </BaseFront>
  );
};

export default Notificacoes;
