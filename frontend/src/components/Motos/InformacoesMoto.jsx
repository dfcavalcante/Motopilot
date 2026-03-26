import React, { useState } from 'react';
import { Box, Stack, Divider, Typography, IconButton, Button, Chip } from '@mui/material';
import Header from '../../utils/Header.jsx';
import SideBar from '../../utils/SideBar.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatContext.jsx';
import AtribuicaoMotoCard from './AtribuicaoMotoCard';
import HistoricoConversasMoto from './HistoricoConversasMoto';

const InformacoesMoto = ({ moto, onBack }) => {
  const navigate = useNavigate();
  const { iniciarNovoChat } = React.useContext(ChatContext);
  const [showHistorico, setShowHistorico] = useState(false);
  const fallbackSrc = '/images/Motopilot.jpeg';
  const estadoAtualMoto = String(moto?.estado || '')
    .trim()
    .toLowerCase();
  const motoConcluida = estadoAtualMoto === 'concluida' || estadoAtualMoto === 'concluída';

  const getImageUrl = (caminhoDoBanco) => {
    if (!caminhoDoBanco) return fallbackSrc;

    const caminhoCorrigido = caminhoDoBanco.replace(/\\/g, '/');
    const pathFinal = caminhoCorrigido.startsWith('/')
      ? caminhoCorrigido.slice(1)
      : caminhoCorrigido;

    const urlFinal = `http://localhost:8000/${pathFinal}`;
    return urlFinal;
  };

  const getStatusStyles = (statusName) => {
    switch (statusName.toLowerCase()) {
      case 'concluído':
      case 'concluido':
        return {
          color: '#29C406',
          border: '1px solid #29C406',
          backgroundColor: '#E5FFDF',
          fontWeight: 700,
        };
      case 'em manutenção':
      case 'em manutencao':
        return {
          color: '#cec108',
          border: '1px solid #cfc209',
          backgroundColor: '#FFFDDF',
          fontWeight: 700,
        };
      default:
        return {
          color: '#6C757D',
          border: '1px solid #6C757D',
          backgroundColor: '#b2bac1',
          fontWeight: 700,
        };
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#989898',
        p: '16px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <SideBar />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%', minHeight: 0, overflow: 'hidden' }}
      >
        <Stack spacing="8px" sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <Box sx={{ flexShrink: 0 }}>
            <Header />
          </Box>

          {/* BOX BRANCA PRINCIPAL */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              bgcolor: 'white',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
            }}
          >
            {/* Conteúdo principal (scrollável) */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                overflowY: 'auto',
                minWidth: 0,
                position: 'relative',
              }}
            >
            {/* Cabeçalho Interno */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                width: '100%',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifySelf: 'start' }}>
                {/*Botão de voltar*/}
                <IconButton
                  onClick={onBack}
                  sx={{
                    color: '#000000',
                    borderRadius: 2,
                    backgroundColor: '#FEDCDB',
                    width: 40,
                    height: 40,
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>

                {/*Botão de editar*/}
                <IconButton
                  onClick={onBack}
                  sx={{
                    color: '#000000',
                    borderRadius: 2,
                    backgroundColor: '#FEDCDB',
                    width: 40,
                    height: 40,
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
                  }}
                >
                  <img src="/images/lapis.png" width={15} height={15} />
                </IconButton>

                {/*Botão de deletar*/}
                <IconButton
                  onClick={onBack}
                  sx={{
                    color: '#000000',
                    borderRadius: 2,
                    backgroundColor: '#FEDCDB',
                    width: 40,
                    height: 40,
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
                  }}
                >
                  <img src="/images/lixeira.png" width={15} height={15} />
                </IconButton>
              </Box>

              <Typography sx={{ fontSize: 30, fontWeight: 500, textAlign: 'center' }}>
                {moto.modelo}
              </Typography>

              {/*Botão de histórico de conversas*/}
              <Box sx={{ justifySelf: 'end' }}>
                <IconButton
                  onClick={() => setShowHistorico((prev) => !prev)}
                  sx={{
                    color: '#fff',
                    borderRadius: 2,
                    width: 40,
                    height: 40,
                    backgroundColor: showHistorico ? '#a00' : '#F30000',
                    '&:hover': { backgroundColor: '#D90000' },
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px', mb: 2 }} />

            {/* Chip no canto direito em cima (Dentro da Box Branca) */}
            <Chip
              label={moto.estado}
              sx={{
                position: 'absolute',
                top: 120,
                right: 100,
                ...getStatusStyles(moto.estado),
                padding: '4px 16px',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />

            <Box
              sx={{
                width: '95%',
                maxWidth: '1600px',
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 1,
              }}
            >
              {/*Botão do Chat da Moto*/}
              <Button
                onClick={() => {
                  if (motoConcluida) {
                    alert('Esta moto já foi concluída e não pode mais acessar o chat.');
                    return;
                  }

                  iniciarNovoChat(moto);
                  navigate('/chatbot');
                }}
                variant="contained"
                disabled={motoConcluida}
                sx={{
                  backgroundColor: '#F30000',
                  color: 'white',
                  top: 300,
                  textTransform: 'none',
                  gap: 1,
                  borderRadius: '16px',
                  padding: '8px 16px',
                  width: '200px',
                  '&:hover': { backgroundColor: '#A5A5A5' },
                  '&:disabled': {
                    backgroundColor: '#9A9A9A',
                    color: '#444',
                  },
                }}
              >
                <img src="/images/estrela.png" alt="Estrelinha" width={18} />
                Chat da Moto
              </Button>
            </Box>

            {/* BOX DA IMAGEM CENTRALIZADA */}
            <Box
              sx={{
                border: '1px solid #A0A0A0',
                borderRadius: '16px',
                width: '380px',
                height: 270,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 2,
                mb: 4,
              }}
            >
              <img
                src={getImageUrl(moto.imagemPath)}
                alt="Imagem Moto"
                onError={(event) => {
                  if (event.currentTarget.src !== fallbackSrc) {
                    event.currentTarget.src = fallbackSrc;
                  }
                }}
                style={{
                  width: '100%',
                  height: '268px',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '16px',
                }}
              />
            </Box>

            {/* Box das Informações (Cinza) */}
            <Box
              sx={{
                boxShadow: 3,
                borderRadius: '16px',
                p: 4,
                width: '95%',
                maxWidth: '1600px',
                minHeight: '300px',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={2} sx={{ flex: 2 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: 30 }}>
                    {moto.modelo || 'Nome da Moto'}
                  </Typography>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#555', display: 'block', fontSize: 16 }}
                    >
                      Número de Série
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 20 }}>
                      {moto.numeroSerie}
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={2} sx={{ flex: 1 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#555', display: 'block', fontSize: 16 }}
                    >
                      Modelo
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {moto.modelo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: '#555', display: 'block', fontSize: 16 }}
                    >
                      Marca
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: '500' }}>
                      {moto.marca}
                    </Typography>
                  </Box>
                </Stack>

                <Stack sx={{ flex: 1, textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#555', display: 'block', fontSize: 16 }}
                  >
                    Ano
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {moto.ano}
                  </Typography>
                </Stack>
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Descrição da máquina
                </Typography>

                <Box
                  sx={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    pr: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#444', textAlign: 'justify' }}>
                    {moto.descricao || 'Sem descrição disponível.'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            </Box>

            {/* Histórico de conversas */}
            {showHistorico && (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Divider orientation="vertical" flexItem />
              </Box>
            )}

            {/* Painel lateral de histórico com animação */}
            <Box
              sx={{
                width: showHistorico ? 278 : 0,
                opacity: showHistorico ? 1 : 0,
                transform: showHistorico ? 'translateX(0)' : 'translateX(16px)',
                overflow: 'hidden',
                flexShrink: 0,
                pointerEvents: showHistorico ? 'auto' : 'none',
                transition: 'width 280ms ease, opacity 220ms ease, transform 280ms ease',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: showHistorico ? '1px solid #e0e0e0' : 'none',
                ml: showHistorico ? 2 : 0,
              }}
            >
              <Typography variant="subtitle1" sx={{ px: 2, pt: 1, pb: 1, fontWeight: 600, flexShrink: 0 }}>
                Histórico
              </Typography>
              <Divider />
              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <HistoricoConversasMoto motoId={moto.id} />
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default InformacoesMoto;
