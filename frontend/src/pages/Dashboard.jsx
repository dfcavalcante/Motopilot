import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';
import BoxDashboard from '../components/Dashboard/BoxDashboard';
import PecasDashboards from '../components/Dashboard/PecasDashboard';
import RelatoriosDashboards from '../components/Dashboard/RelatoriosDashboard';
import UsuariosDashboards from '../components/Dashboard/UsuariosDashboard';

const Dashboard = () => {
  return (
    <BaseFrontDashboard>
      {/* 4 BoxDasboards um do lado do outro */}
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={2}
        marginTop={4}
      >
        <BoxDashboard
          icone={<img src="/images/MotoIcone.png" alt="Ícone" width={40} height={25} />}
          titulo={'Total de motos'}
          descricao={'+14% em relação Sem.Passada'}
          numero={100}
        />
        <BoxDashboard
          icone={<img src="/images/MotoIcone.png" alt="Ícone" width={40} height={25} />}
          titulo={'Motos em Manutenção'}
          descricao={'+14% em relação Sem.Passada'}
          numero={200}
        />
        <BoxDashboard
          icone={<img src="/images/MotoIcone.png" alt="Ícone" width={40} height={25} />}
          titulo={'Motos Disponíveis'}
          descricao={'+14% em relação Sem.Passada'}
          numero={300}
        />
        <BoxDashboard
          icone={<img src="/images/MotoIcone.png" alt="Ícone" width={40} height={25} />}
          titulo={'Motos Concluídas'}
          descricao={'+14% em relação Sem.Passada'}
          numero={300}
        />
      </Box>

      <Grid>
        <PecasDashboards />
      </Grid>
    </BaseFrontDashboard>
  );
};

export default Dashboard;
