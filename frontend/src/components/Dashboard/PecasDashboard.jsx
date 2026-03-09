import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const BoxPeças = ({ nome, data }) => {
  return (
    <Box width="96%" height={50} backgroundColor={'#ffffff'} borderRadius={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} padding={2}>
        <Typography fontSize={15} variant="body-1">
          {nome}
        </Typography>

        <Typography fontSize={15} variant="body-2">
          {data}
        </Typography>
      </Stack>
    </Box>
  );
};

{
  /*Componente do Dashboard para mostrar as peças defeituosas*/
}
const PecasDashboards = () => {
  const pecas = [
    {
      nome: 'Correia Tração Gp7 Citycom 300',
      data: '17:40',
    },
    {
      nome: 'Correia Tração Gp7 Citycom 300',
      data: '8:50',
    },
  ]; //dps vem o context das peças aq quando tiver o backend

  return (
    <Box
      backgroundColor={'#D9D9D9'}
      width="100%"
      height="100%"
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
      borderRadius={4}
    >
      <Typography variant="h5" marginBottom={2} marginTop={3}>
        Peças defeituosas mais frequentes
      </Typography>

      <Stack spacing={2} padding={2} width="100%" alignItems="center">
        {pecas.map((peca) => (
          <BoxPeças nome={peca.nome} data={peca.data} />
        ))}
      </Stack>
    </Box>
  );
};

export default PecasDashboards;
