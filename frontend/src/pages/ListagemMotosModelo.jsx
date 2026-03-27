import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import BaseFront from '../utils/BaseFront';
import { HookListagemMotosModelo } from '../hooks/HookListagemMotosModelo';
import InformacoesMoto from '../components/Motos/InformacoesMoto';
import { useNavigate } from 'react-router-dom';
import ListToolbar from '../components/CadastroMoto/ListToolBar';
import MotoListItem from '../components/CadastroMoto/MotoListItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ListagemMotos = () => {
  const [motoEmDetalhe, setMotoEmDetalhe] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
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
    isGerente,
    handleExcluirModelo,
  } = HookListagemMotosModelo();

  if (motoEmDetalhe) {
    return <InformacoesMoto moto={motoEmDetalhe} onBack={() => setMotoEmDetalhe(null)} />;
  }

  return (
    <BaseFront
      icone={null}
      width={null}
      height={null}
      nome={'Motos'}
      headerAction={
        <IconButton
          onClick={() => navigate('/listagemMotos')}
          sx={{ color: '#000', bgcolor: '#FEDCDB', width: 40, height: 40, borderRadius: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
      }
      headerRightAction={
        isGerente ? (
          <IconButton
            onClick={() => setOpenConfirmDelete(true)}
            sx={{ color: '#000', bgcolor: '#FEDCDB', width: 40, height: 40, borderRadius: 2 }}
          >
            <img src="/images/lixeira.png" width={15} height={15} alt="Excluir modelo" />
          </IconButton>
        ) : null
      }
    >
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

      <Dialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir modelo de moto</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#444' }}>
            Tem certeza que deseja excluir este modelo? Todas as motos filhas desse modelo serão
            apagadas automaticamente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenConfirmDelete(false)}
            sx={{ color: '#333', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              setOpenConfirmDelete(false);
              await handleExcluirModelo();
            }}
            variant="contained"
            sx={{ bgcolor: '#F30000', textTransform: 'none', '&:hover': { bgcolor: '#D80000' } }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </BaseFront>
  );
};

export default ListagemMotos;
