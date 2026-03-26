import { createContext, useState, useCallback } from 'react';
import React from 'react';
import { getAuthHeaders } from './LoginContext';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalMotos, setTotalMotos] = useState(0);
  const [motosManutencao, setMotosManutencao] = useState(0);
  const [motosDisponiveis, setMotosDisponiveis] = useState(0);
  const [motosConcluidas, setMotosConcluidas] = useState(0);
  const [motosAguardandoManutencao, setMotosAguardandoManutencao] = useState(0);

  const [relatoriosPendentes, setRelatoriosPendentes] = useState(0);
  const [relatoriosConcluidos, setRelatoriosConcluidos] = useState(0);
  const [relatoriosTotais, setRelatoriosTotais] = useState(0);
  const [pecasFrequentes, setPecasFrequentes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  // --- DASHBOARD GERENTE ---
  const buscarDashboardGerente = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(`${BASE_URL}/dashboard/gerente`, {
        headers: { ...getAuthHeaders() },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessao expirada. Faca login novamente.');
        }
        throw new Error('Erro ao buscar dados do dashboard do gerente');
      }

      const data = await response.json();

      setTotalUsuarios(data.total_usuarios ?? 0);
      setTotalMotos(data.total_motos ?? 0);
      setMotosManutencao(data.motos_em_manutencao ?? 0);
      setMotosDisponiveis(data.motos_disponiveis ?? 0);
      setMotosConcluidas(data.motos_concluidas ?? 0);
      setMotosAguardandoManutencao(data.motos_aguardando_manutencao ?? 0);

      setRelatoriosPendentes(data.relatorios_pendentes ?? 0);
      setRelatoriosConcluidos(data.relatorios_concluidos ?? 0);
      setRelatoriosTotais(data.total_manutencoes_realizadas ?? 0);

      setPecasFrequentes(Array.isArray(data.pecas) ? data.pecas : []);

      return data;
    } catch (error) {
      console.error('Erro no buscarDashboardGerente:', error);
      setErro(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  return (
    <DashboardContext.Provider
      value={{
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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
