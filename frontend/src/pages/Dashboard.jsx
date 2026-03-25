import React, { useContext, useMemo } from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material'; // Grid removido!
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';
import BoxDashboard from '../components/Dashboard/BoxDashboard';
import RelatoriosDashboards from '../components/Dashboard/RelatoriosDashboard';
import HookDashboard from '../hooks/HookDashboard';

import Barras from '../components/Graficos/Barras.jsx';
import { GraficoContext } from '../context/GraficosContext.jsx';

const Dashboard = () => {
  const { graficosPeca, loading, erro } = useContext(GraficoContext);

  const {
    totalMotos,
    motosManutencao,
    motosDisponiveis,
    motosConcluidas,
    relatoriosPendentes,
    relatoriosConcluidos,
    relatoriosTotais,
  } = HookDashboard();

  const cardStyle = {
    p: 3,
    borderRadius: '16px',
    border: '1px solid #e0e0e0',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Impede que coisas vazem do card
  };

  const motosStats = useMemo(
    () => [
      { titulo: 'Total de motos', valor: totalMotos },
      { titulo: 'Motos em Manutenção', valor: motosManutencao },
      { titulo: 'Motos Disponíveis', valor: motosDisponiveis },
      { titulo: 'Motos Concluídas', valor: motosConcluidas },
    ],
    [totalMotos, motosManutencao, motosDisponiveis, motosConcluidas]
  );

  return (
    <BaseFrontDashboard>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          width: '100%',
          height: '100%',
          overflow: 'hidden', // proibi scroll
        }}
      >
        {/* ================= LADO ESQUERDO ================= */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minWidth: 0,
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 2,
            }}
          >
            {motosStats.map((item, index) => (
              <BoxDashboard
                key={index}
                icone={
                  <img
                    src="/images/MotoIcone.png"
                    alt="Ícone"
                    width={40}
                    height={25}
                    style={{ objectFit: 'contain' }}
                  />
                }
                titulo={item.titulo}
                descricao="+14% em relação Sem.Passada"
                numero={item.valor}
              />
            ))}
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <RelatoriosDashboards
              relatoriosPendentes={relatoriosPendentes}
              relatoriosConcluidos={relatoriosConcluidos}
              relatoriosTotais={relatoriosTotais}
            />
          </Box>
        </Box>

        {/* ================= LADO DIREITO ================= */}
        <Box sx={{ flex: 1, minWidth: 0, height: '100%' }}>
          <Paper sx={cardStyle}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Peças quebradas com mais frequência
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Total acumulado
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* O Gráfico se ajusta a qualquer espaço que o Paper liberar */}
            <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <Barras title="" data={graficosPeca} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </BaseFrontDashboard>
  );
};

export default Dashboard;
