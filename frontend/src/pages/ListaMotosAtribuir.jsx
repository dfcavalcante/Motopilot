import React from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import BaseFront from './../utils/BaseFront';
import { MotoContext } from '../context/MotoContext';

//Página que lista as motos que vão ser atribuídas a um mecânico específico
const ListaMotosAtribuir = () => {
  const { atribuirMoto, motosModelo } = React.useContext(MotoContext);

  return (
    <BaseFront nome={'Lista de Motos para Atribuir'}>
      <Box display="flex" alignItems="center" mt={1} sx={{ width: '100%', px: 2 }}>
        <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} ml={9}>
            <Typography sx={{ fontWeight: '500', color: 'grey.900' }}>Ordenar</Typography>
            <IconButton
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
          </Box>
        </Box>
        <Box sx={{ flex: 1 }} />
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
          {motosModelo.length > 0 ? (
            motosModelo.map((moto) => (
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

export default ListaMotosAtribuir;