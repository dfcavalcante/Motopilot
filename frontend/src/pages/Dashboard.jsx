import React from 'react';
import { Box } from '@mui/material';
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';
import BoxDashboard from '../components/Dashboard/BoxDashboard';
import RelatoriosDashboards from '../components/Dashboard/RelatoriosDashboard';
import UsuariosDashboards from '../components/Dashboard/UsuariosDashboard';
import HookDashboard from '../hooks/HookDashboard';

const Dashboard = () => {
  const {
    totalMotos,
    motosManutencao,
    motosDisponiveis,
    motosConcluidas,
    relatoriosPendentes,
    relatoriosConcluidos,
    relatoriosTotais,
    pecasFrequentes,
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
              flexDirection: 'column',
              gap: 2,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <Box sx={{ flex: 2, minHeight: 0 }}>
              <RelatoriosDashboards
                relatoriosPendentes={relatoriosPendentes}
                relatoriosConcluidos={relatoriosConcluidos}
                relatoriosTotais={relatoriosTotais}
              />
            </Box>
            <Box sx={{ flex: 1.5, minHeight: 0 }}>
              <UsuariosDashboards />
            </Box>
          </Box>

        </Box>
      </Box>
    </BaseFrontDashboard>
  );
};

export default Dashboard;
