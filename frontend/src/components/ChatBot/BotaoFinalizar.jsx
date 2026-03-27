import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../utils/toastConfig.jsx';

const BotaoFinalizar = ({ onFinalizar }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const confirmarFinalizacao = async () => {
    setOpenConfirm(false);
    setLoading(true);
    try {
      const relatorio = await onFinalizar();

      if (relatorio) {
        // Redireciona para a página de relatórios
        navigate('/relatorios', { state: { novoRelatorioId: relatorio.id } });
      } else {
        notify.error('Erro ao criar o relatório. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao finalizar:', error);
      notify.error('Erro ao finalizar o atendimento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : <AssignmentTurnedInIcon />
        }
        onClick={() => setOpenConfirm(true)}
        sx={{
          height: 40,
          minHeight: 40,
          borderRadius: '8px',
          color: '#fff',
          backgroundColor: '#F30000',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#D90000',
          },
          '&:disabled': {
            backgroundColor: '#FFDBDB',
            color: '#000000',
          },
        }}
      >
        {loading ? 'Gerando Relatório...' : 'Finalizar Atendimento'}
      </Button>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Finalizar atendimento</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#444' }}>
            Deseja finalizar este atendimento e gerar o relatório?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenConfirm(false)}
            sx={{ color: '#333', textTransform: 'none' }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmarFinalizacao}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: '#F30000', textTransform: 'none', '&:hover': { bgcolor: '#D80000' } }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BotaoFinalizar;
