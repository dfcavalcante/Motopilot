import React, { useEffect, useMemo } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';

import Pizza from '../components/Graficos/Pizzza.jsx';
import Rosquinha from '../components/Graficos/Rosquinha.jsx';
import Barras from '../components/Graficos/Barras.jsx';

import { GraficoContext } from '../context/GraficosContext.jsx';

const Graficos = () => {
  const { graficosRelatorio, graficosMoto, graficosPeca, loading, erro } =
    React.useContext(GraficoContext);

  return (
    <BaseFrontDashboard>
      {erro && <Alert severity="error">{erro}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Pizza title="Motos por status" data={graficosMoto} />
          <Barras title="Peças quebradas com mais frequencia" data={graficosPeca} />
          <Rosquinha title="Relatórios: Pendentes vs Concluídos" data={graficosRelatorio} />
        </>
      )}
    </BaseFrontDashboard>
  );
};

export default Graficos;
