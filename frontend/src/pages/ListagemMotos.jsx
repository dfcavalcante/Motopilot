import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Box, Grid, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import BaseFront from '../utils/BaseFront';
import BoxMoto from '../components/CadastroMoto/BoxMoto';
import { MotoContext } from '../context/MotoContext';
import BarraPesquisa from '../components/CadastroMoto/BarraPesquisa';
import InformacoesMoto from '../components/Motos/InformacoesMoto';

const ListagemMotos = () => {
  const { listarMotos, motos, excluirMoto, atualizarMoto } = useContext(MotoContext);

  const [input, setInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [tipoOrdenacao, setTipoOrdenacao] = useState(null);
  const [motoSelecionada, setMotoSelecionada] = useState(null);

  useEffect(() => {
    listarMotos();
  }, []);

  const openMenu = Boolean(anchorEl);
  const handleClickOrdernar = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleSelectOrder = (tipo) => {
    setTipoOrdenacao(tipo);
    handleCloseMenu();
  };

  const motosProcessadas = useMemo(() => {
    let lista = [...motos];
    if (input) {
      lista = lista.filter(
        (moto) =>
          moto.modelo?.toLowerCase().includes(input.toLowerCase()) ||
          moto.marca?.toLowerCase().includes(input.toLowerCase())
      );
    }
    if (tipoOrdenacao === 'AZ') {
      lista.sort((a, b) => a.modelo.localeCompare(b.modelo));
    } else if (tipoOrdenacao === 'ZA') {
      lista.sort((a, b) => b.modelo.localeCompare(a.modelo));
    }
    return lista;
  }, [motos, input, tipoOrdenacao]);

  if (motoSelecionada) {
    return <InformacoesMoto moto={motoSelecionada} onBack={() => setMotoSelecionada(null)} />;
  }

  return (
    <BaseFront icone={null} width={null} height={null} nome={'Motos'}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          position: 'relative',
          mt: 1,
        }}
      >
        <Typography sx={{ position: 'absolute', left: 0, fontWeight: '500', color: 'grey.900' }}>
          Ordenar
        </Typography>
        <IconButton
          onClick={handleClickOrdernar}
          sx={{
            position: 'absolute',
            left: 70,
            width: 20,
            height: 20,
            borderRadius: '4px',
            border: '1px solid #E0E0E0',
          }}
        >
          <img src="/images/linhaPraBaixo.png" alt="Ordenar" style={{ width: '10px' }} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
          <MenuItem onClick={() => handleSelectOrder('AZ')}>Modelo A-Z</MenuItem>
          <MenuItem onClick={() => handleSelectOrder('ZA')}>Modelo Z-A</MenuItem>
        </Menu>

        <BarraPesquisa input={input} setInput={setInput} />
      </Box>

      {/* Grid de Motos */}
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
                <BoxMoto moto={moto} onEnter={() => setMotoSelecionada(moto)} />
              </Grid>
            ))
          ) : (
            <Typography sx={{ p: 2, width: '100%', textAlign: 'center' }}>
              Nenhuma moto encontrada.
            </Typography>
          )}
        </Grid>
      </Box>
    </BaseFront>
  );
};

export default ListagemMotos;
