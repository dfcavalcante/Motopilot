import React from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BaseFront from '../utils/BaseFront';
import BoxMoto from '../components/CadastroMoto/BoxMoto';
import InformacoesMoto from '../components/Motos/InformacoesMoto';
import ListagemMotosModeloControls from '../components/Motos/ListagemMotosModeloControls.jsx';
import AtribuicaoMotoCard from '../components/Motos/AtribuicaoMotoCard.jsx';
import { HookListagemMotosModelo } from '../hooks/HookListagemMotosModelo.jsx';

const ListagemMotosModelo = () => {
  const navigate = useNavigate();
  const {
    modeloPai,
    motoSelecionada,
    setMotoSelecionada,
    isGerente,
    isTecnico,
    input,
    setInput,
    anchorEl,
    openMenu,
    handleClickOrdernar,
    handleCloseMenu,
    handleSelectOrder,
    motosProcessadas,
    tecnicos,
    mecanicoSelecionado,
    setMecanicoSelecionado,
    handleAtribuirMoto,
    getNomeMecanico,
  } = HookListagemMotosModelo();

  if (motoSelecionada) {
    return <InformacoesMoto moto={motoSelecionada} onBack={() => setMotoSelecionada(null)} />;
  }

  return (
    <BaseFront
      nome={modeloPai ? `${modeloPai.marca} ${modeloPai.modelo}` : 'Motos do modelo'}
      headerAction={
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: '#000000',
            borderRadius: 2,
            backgroundColor: '#B5B5B5',
            width: 40,
            height: 40,
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      }
    >
      <ListagemMotosModeloControls
        input={input}
        setInput={setInput}
        anchorEl={anchorEl}
        openMenu={openMenu}
        handleClickOrdernar={handleClickOrdernar}
        handleCloseMenu={handleCloseMenu}
        handleSelectOrder={handleSelectOrder}
      />

      <Box
        backgroundColor="#DBDBDB"
        sx={{
          flexGrow: 100,
          width: '100%',
          borderRadius: '16px',
          pl: 8,
          mt: 2,
          overflowY: 'auto',
        }}
      >
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {motosProcessadas.length > 0 ? (
            motosProcessadas.map((moto) => (
              <Grid item key={moto.id} xs={12} sm={6} md={4}>
                <BoxMoto
                  moto={moto}
                  onEnter={() => setMotoSelecionada(moto)}
                  mecanicoNome={getNomeMecanico(moto)}
                />
                {isGerente && (
                  <AtribuicaoMotoCard
                    motoId={moto.id}
                    tecnicos={tecnicos}
                    mecanicoSelecionado={mecanicoSelecionado}
                    setMecanicoSelecionado={setMecanicoSelecionado}
                    onAtribuir={handleAtribuirMoto}
                  />
                )}
              </Grid>
            ))
          ) : (
            <Typography sx={{ p: 2, width: '100%', textAlign: 'center' }}>
              {isTecnico
                ? 'Nenhuma moto atribuída a você neste modelo.'
                : 'Nenhuma moto cadastrada para este modelo.'}
            </Typography>
          )}
        </Grid>
      </Box>
    </BaseFront>
  );
};

export default ListagemMotosModelo;
