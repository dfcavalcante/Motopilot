import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from 'react-router-dom';

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
          alert('Erro ao criar o relatório. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao finalizar:', error);
        alert('Erro ao finalizar o atendimento.');
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
        borderRadius: '10px',
        backgroundColor: '#444',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#666',
        },
        '&:disabled': {
          backgroundColor: '#999',
        },
      }}
    >
      {loading ? 'Gerando Relatório...' : 'Finalizar Atendimento'}
    </Button>
  );
};

export default BotaoFinalizar;
