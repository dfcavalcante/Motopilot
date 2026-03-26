import React from 'react';
import { Box, Grid, Paper, Typography, Divider } from '@mui/material';
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';
import BoxDashboard from '../components/Dashboard/BoxDashboard';
import RelatoriosDashboards from '../components/Dashboard/RelatoriosDashboard';
import HookDashboard from '../hooks/HookDashboard';

import Barras from '../components/Graficos/Barras.jsx';
import { GraficoContext } from '../context/GraficosContext.jsx';

const Dashboard = () => {
  const { graficosPeca, loading, erro } = React.useContext(GraficoContext);

   const cardStyle = {
    p: 4,
    borderRadius: '16px',
    border: '1px solid #e0e0e0',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  };

  const {
    totalMotos,
    motosManutencao,
    motosDisponiveis,
    motosConcluidas,
    relatoriosPendentes,
    relatoriosConcluidos,
    relatoriosTotais,
  } = HookDashboard();

  return (
    <BaseFrontDashboard>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 4 BoxDashboards das motos */}
        <Box
          sx={{
            display: 'flex',
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
            numero={totalMotos}
          />
          <BoxDashboard
            icone={<img src="/images/MotoIcone.png" alt="Ícone" width={40} height={25} />}
            titulo={'Motos em Manutenção'}
            descricao={'+14% em relação Sem.Passada'}
            numero={motosManutencao}
          />
          <BoxDashboard
            icone={<img src="/images/MotoIcone.png" alt="Ícone" width={40} height={25} />}
            titulo={'Motos Disponíveis'}
            descricao={'+14% em relação Sem.Passada'}
            numero={motosDisponiveis}
          />
          <BoxDashboard
            icone={<img src="/images/MotoIcone.png" alt="Ícone" width={40} height={25} />}
            titulo={'Motos Concluídas'}
            descricao={'+14% em relação Sem.Passada'}
            numero={motosConcluidas}
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
              flexDirection: 'row',
              gap: 2,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <RelatoriosDashboards
                relatoriosPendentes={relatoriosPendentes}
                relatoriosConcluidos={relatoriosConcluidos}
                relatoriosTotais={relatoriosTotais}
              />
            </Box>

            {/* Gráficos de peças*/}
            <Box sx={{flex: 3, minHeight: 0}}>
              <Paper sx={cardStyle}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Peças quebradas com mais frequência
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Total acumulado
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ minHeight: '400px', width: '100%' }}>
                  <Barras title="" data={graficosPeca} />
                </Box>
              </Paper>
            </Box>

          </Box>
        </Box>
      </Box>
    </BaseFrontDashboard>
  );
};

export default Dashboard;
