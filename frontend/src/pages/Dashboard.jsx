import React from 'react';
import { Box } from '@mui/material';
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';
import BoxDashboard from '../components/Dashboard/BoxDashboard';
import PecasDashboards from '../components/Dashboard/PecasDashboard';
import RelatoriosDashboards from '../components/Dashboard/RelatoriosDashboard';
import UsuariosDashboards from '../components/Dashboard/UsuariosDashboard';

const Dashboard = () => {
  return (
    <BaseFrontDashboard>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 2, //n mexer no padding pq tem que caber as boxes do dashboard
        }}
      >
        {/* 4 BoxDashboards das motos */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between', 
            mb: 2,
            flexShrink: 0,
            width: '100%',
          }}
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

        {/* Em Baixo: Tudo que tem em baixo das motos  */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Lado esquerdo */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <Box sx={{ flex: 2, minHeight: 0 }}>
              <RelatoriosDashboards />
            </Box>
            <Box sx={{ minHeight: 0 }}>
              <UsuariosDashboards />
            </Box>
          </Box>

          {/* Lado direito */}
          <Box
            sx={{
              flex: 1.25, //pro lado direito ser maior que o esquerdo
              minWidth: 0,
              minHeight: 0,
              height: '100%', 
            }}
          >
            <PecasDashboards />
          </Box>
        </Box>
      </Box>
    </BaseFrontDashboard>
  );
};

export default Dashboard;
