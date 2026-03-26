import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { getAuthHeaders } from '../../context/LoginContext';

const BASE_URL = 'http://localhost:8000';

const HistoricoConversasMoto = ({ motoId }) => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!motoId) return;

    const fetchHistorico = async () => {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`${BASE_URL}/chatbot/historico/moto/${motoId}`, {
          headers: { ...getAuthHeaders() },
        });
        if (!response.ok) throw new Error('Erro ao buscar histórico');
        const data = await response.json();
        // O backend retorna do mais recente pro mais antigo, invertemos para cronológico
        setHistorico(data.reverse());
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, [motoId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={28} sx={{ color: '#F30000' }} />
      </Box>
    );
  }

  if (erro) {
    return (
      <Typography sx={{ p: 2, color: '#999', textAlign: 'center' }}>
        Erro ao carregar histórico.
      </Typography>
    );
  }

  if (historico.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#999', fontSize: 14 }}>
          Nenhuma conversa registrada para esta moto.
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        maxHeight: '400px',
        overflowY: 'auto',
        p: 2,
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: 3,
        },
      }}
    >
      {historico.map((item, index) => (
        <React.Fragment key={item.id || index}>
          {/* Pergunta do mecânico */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: '#444',
                flexShrink: 0,
                mt: 0.3,
              }}
            >
              <PersonIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  color: '#888',
                  mb: 0.3,
                  fontWeight: 500,
                }}
              >
                Mecânico • {formatDate(item.created_at)}
              </Typography>
              <Box
                sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: '12px',
                  p: 1.5,
                  fontSize: 13,
                  color: '#333',
                  lineHeight: 1.5,
                }}
              >
                {item.pergunta}
              </Box>
            </Box>
          </Box>

          {/* Resposta da IA */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: '#F30000',
                flexShrink: 0,
                mt: 0.3,
              }}
            >
              <SmartToyIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  color: '#888',
                  mb: 0.3,
                  fontWeight: 500,
                }}
              >
                MotoPilot IA
              </Typography>
              <Box
                sx={{
                  bgcolor: '#FFF5F5',
                  border: '1px solid #FFE0E0',
                  borderRadius: '12px',
                  p: 1.5,
                  fontSize: 13,
                  color: '#333',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {item.resposta_ia}
              </Box>
            </Box>
          </Box>

          {index < historico.length - 1 && (
            <Divider sx={{ my: 0.5, borderColor: '#f0f0f0' }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default HistoricoConversasMoto;
