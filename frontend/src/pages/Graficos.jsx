import React, { useEffect, useMemo } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import BaseFrontDashboard from '../components/Dashboard/BaseFrontDashboard';
import Rosquinha from '../components/Graficos/Rosquinha.jsx';
import { ReportContext } from './../context/ReportContext';
import { useLogin } from '../context/LoginContext.jsx';

const Graficos = () => {
  const { relatorios, listarRelatorios, loading, erro } = React.useContext(ReportContext);
  const { user } = useLogin();

  useEffect(() => {
    if (user?.id) {
      listarRelatorios({ cliente_id: user.id, per_page: 100 });
    }
  }, [user?.id, listarRelatorios]);

  const relatoriosPorMecanico = useMemo(() => {
    const agrupado = relatorios.reduce((acc, relatorio) => {
      const chave = relatorio.mecanicos?.trim() || 'Nao informado';
      acc[chave] = (acc[chave] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(agrupado).map(([name, value]) => ({ name, value }));
  }, [relatorios]);

  return (
    <BaseFrontDashboard>
      {erro && <Alert severity="error">{erro}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Rosquinha title="Relatorios por mecanico" data={relatoriosPorMecanico} />
      )}
    </BaseFrontDashboard>
  );
};

export default Graficos;
