import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../utils/toastConfig.jsx';

const BotaoFinalizar = ({ onFinalizar }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinalizar = async () => {
    const confirmou = window.confirm('Deseja finalizar este atendimento e gerar o relatório?');
    if (confirmou) {
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
    }
  };

  return (
    <Button
      variant="contained"
      disabled={loading}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : <AssignmentTurnedInIcon />
      }
      onClick={handleFinalizar}
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
          backgroundColor: '#999',
          color: '#000000',
        },
      }}
    >
      {loading ? 'Gerando Relatório...' : 'Finalizar Atendimento'}
    </Button>
  );
};

export default BotaoFinalizar;
