import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import BaseFront from '../utils/BaseFront';
import { HookListagemMotosModelo } from '../hooks/HookListagemMotosModelo';
import InformacoesMoto from '../components/Motos/InformacoesMoto';
import { useNavigate } from 'react-router-dom';
import ListToolbar from '../components/CadastroMoto/ListToolBar';
import MotoListItem from '../components/CadastroMoto/MotoListItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ListagemMotos = () => {
  const [motoEmDetalhe, setMotoEmDetalhe] = useState(null);
  const navigate = useNavigate();

  const {
    input,
    setInput,
    anchorEl,
    handleClickOrdernar,
    handleSelectOrder,
    handleCloseMenu,
    motosProcessadas,
    getNomeMecanico,
    setMotoSelecionada,
  } = HookListagemMotosModelo();

  if (motoEmDetalhe) {
    return <InformacoesMoto moto={motoEmDetalhe} onBack={() => setMotoEmDetalhe(null)} />;
  }

  return (
    <BaseFront icone={null} width={null} height={null} nome={'Motos'}>
      <IconButton
        onClick={() => navigate('/listagemMotos')}
        sx={{
          color: '#000000',
          borderRadius: 2,
          backgroundColor: '#FEDCDB',
          width: 40,
          height: 40,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      
      <Box sx={{ width: '100%', margin: '0 auto', p: 3 }}>
        {/* Toolbar Superior (Busca e Ordenação) */}
        <ListToolbar
          input={input}
          setInput={setInput}
          anchorEl={anchorEl}
          onOpenMenu={handleClickOrdernar}
          onCloseMenu={handleCloseMenu}
          onSelectOrder={handleSelectOrder}
        />

        {/* Cabeçalho das Colunas  */}
        <Box
          sx={{
            display: 'flex',
            px: 3,
            pb: 1,
            mb: 2,
            borderBottom: '1px dotted #CCC',
            color: '#666',
            fontSize: '14px',
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>Moto</Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>Status</Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>Colaborador</Box>
          <Box sx={{ width: 40 }} />
        </Box>

        <Box
          sx={{
            maxHeight: '60vh',
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: '#F0F0F0', borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb': { background: '#D9A1A1', borderRadius: '10px' },
          }}
        >
          {motosProcessadas.length > 0 ? (
            motosProcessadas.map((moto) => (
              <MotoListItem
                key={moto.id}
                moto={{
                  ...moto,
                  colaborador_nome: getNomeMecanico(moto) || '',
                  status: moto.estado || moto.status || '',
                }}
                onInfoClick={(motoSelecionada) => {
                  setMotoSelecionada(motoSelecionada);
                  setMotoEmDetalhe(motoSelecionada);
                }}
              />
            ))
          ) : (
            <Typography sx={{ p: 4, width: '100%', textAlign: 'center', color: '#999' }}>
              Nenhuma moto encontrada.
            </Typography>
          )}
        </Box>
      </Box>
    </BaseFront>
  );
};

export default ListagemMotos;
