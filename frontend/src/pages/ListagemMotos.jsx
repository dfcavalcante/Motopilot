import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Box, Grid, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseFront from '../utils/BaseFront';
import BoxMoto from '../components/CadastroMoto/BoxMoto';
import { MotoContext } from '../context/MotoContext';
import BarraPesquisa from '../components/CadastroMoto/BarraPesquisa';

const ListagemMotos = () => {
  const navigate = useNavigate();
  const { listarModelosMoto, modelosMoto, setModeloPaiSelecionado } = useContext(MotoContext);

  const [input, setInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [tipoOrdenacao, setTipoOrdenacao] = useState(null);

  useEffect(() => {
    listarModelosMoto();
  }, []);

  const openMenu = Boolean(anchorEl);
  const handleClickOrdernar = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleSelectOrder = (tipo) => {
    setTipoOrdenacao(tipo);
    handleCloseMenu();
  };

  const motosProcessadas = useMemo(() => {
    let lista = [...modelosMoto];
    if (input) {
      lista = lista.filter(
        (modeloMoto) =>
          modeloMoto.modelo?.toLowerCase().includes(input.toLowerCase()) ||
          modeloMoto.marca?.toLowerCase().includes(input.toLowerCase())
      );
    }
    if (tipoOrdenacao === 'AZ') {
      lista.sort((a, b) => a.modelo.localeCompare(b.modelo));
    } else if (tipoOrdenacao === 'ZA') {
      lista.sort((a, b) => b.modelo.localeCompare(a.modelo));
    }
    return lista;
  }, [modelosMoto, input, tipoOrdenacao]);

  return (
    <BaseFront icone={null} width={null} height={null} nome={'Motos'}>
      <Box display="flex" alignItems="center" mt={1} sx={{ width: '100%', px: 2 }}>
        <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} ml={9}>
            <Typography sx={{ fontWeight: '500', color: 'grey.900' }}>Ordenar</Typography>
            <IconButton
              onClick={handleClickOrdernar}
              sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: '1px solid #E0E0E0',
                backgroundColor: 'white',
              }}
            >
              <img src="/images/linhaPraBaixo.png" alt="Ordenar" style={{ width: '10px' }} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
              <MenuItem onClick={() => handleSelectOrder('AZ')}>Modelo A - Z</MenuItem>
              <MenuItem onClick={() => handleSelectOrder('ZA')}>Modelo Z - A</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box sx={{ width: '580px' }}>
          <BarraPesquisa input={input} setInput={setInput} />
        </Box>

        <Box sx={{ flex: 1 }} />
      </Box>

      {/* Grid de Motos */}
      <Box
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
            motosProcessadas.map((modeloMoto) => (
              <Grid item key={modeloMoto.id} xs={12} sm={6} md={4}>
                <BoxMoto
                  moto={modeloMoto}
                  tipo="pai"
                  onEnter={() => {
                    setModeloPaiSelecionado(modeloMoto);
                    navigate(`/modeloMoto/${modeloMoto.id}/motos`);
                  }}
                />
              </Grid>
            ))
          ) : (
            <Typography sx={{ p: 2, width: '100%', textAlign: 'center' }}>
              Nenhum modelo de moto encontrado.
            </Typography>
          )}
        </Grid>
      </Box>
    </BaseFront>
  );
};

export default ListagemMotos;
