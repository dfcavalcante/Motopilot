import React from 'react';
import { Alert, Box, CircularProgress, Typography, Grid, Paper, Divider } from '@mui/material';
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';

import Pizza from '../components/Graficos/Pizzza.jsx';
import Rosquinha from '../components/Graficos/Rosquinha.jsx';
import Barras from '../components/Graficos/Barras.jsx';

import { GraficoContext } from '../context/GraficosContext.jsx';

const Graficos = () => {
  const { graficosRelatorio, graficosMoto, graficosPeca, loading, erro } =
    React.useContext(GraficoContext);

  // Estilo de Card Expandido e Minimalista
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

  return (
    <BaseFrontDashboard>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 800, color: '#000', mb: 1, letterSpacing: '-1px' }}
        >
          Dashboard de Performance
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', fontWeight: 400 }}>
          Análise detalhada de status, peças e relatórios.
        </Typography>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
          {erro}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress sx={{ color: '#000' }} size={60} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Layout Grid de Largura Total (Full Width) */}

          <Grid item xs={12}>
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
                  Peças defeituosas mais frequentes
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ minHeight: '400px', width: '100%' }}>
                <Barras title="" data={graficosPeca} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Paper sx={cardStyle}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Motos por status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box 
                sx={{ 
                  minHeight: '400px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%' 
                }}
              >
                <Pizza title="" data={graficosMoto} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Paper sx={cardStyle}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Relatórios: Pendentes vs Concluídos
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  minHeight: '400px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Rosquinha title="" data={graficosRelatorio} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </BaseFrontDashboard>
  );
};

export default Graficos;
