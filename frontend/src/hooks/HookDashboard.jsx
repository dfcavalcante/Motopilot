import { useContext, useEffect } from 'react';
import { DashboardContext } from '../context/DashboardContext';

export const HookDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('HookDashboard deve ser usado dentro de DashboardProvider');
  }

  const {
    totalUsuarios,
    totalMotos,
    motosManutencao,
    motosDisponiveis,
    motosConcluidas,
    motosAguardandoManutencao,
    relatoriosPendentes,
    relatoriosConcluidos,
    relatoriosTotais,
    pecasFrequentes,
    buscarDashboardGerente,
    loading,
    erro,
  } = context;

  useEffect(() => {
    buscarDashboardGerente();
  }, [buscarDashboardGerente]);

  return {
    totalUsuarios,
    totalMotos,
    motosManutencao,
    motosDisponiveis,
    motosConcluidas,
    motosAguardandoManutencao,
    relatoriosPendentes,
    relatoriosConcluidos,
    relatoriosTotais,
    pecasFrequentes,
    atualizarDashboard: buscarDashboardGerente,
    loading,
    erro,
  };
};

export default HookDashboard;
