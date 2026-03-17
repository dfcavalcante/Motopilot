import { createContext, useEffect, useState } from 'react';
import React from 'react';

export const GraficoContext = createContext();

export const GraficoProvider = ({ children }) => {
  const [graficosMoto, setGraficosMoto] = useState([]);
  const [graficosRelatorio, setGraficosRelatorio] = useState([]);
  const [graficosPeca, setGraficosPeca] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setErro(null);
      try {
        const [motoRes, relatorioRes, pecaRes] = await Promise.all([
          fetch(`${BASE_URL}/motos/graficos/motos`),
          fetch(`${BASE_URL}/relatorio/graficos/relatorios`),
          fetch(`${BASE_URL}/relatorio/graficos/pecas`),
        ]);

        if (!motoRes.ok || !relatorioRes.ok || !pecaRes.ok) {
          throw new Error('Erro ao buscar dados dos gráficos');
        }

        const [motoData, relatorioData, pecaData] = await Promise.all([
          motoRes.json(),
          relatorioRes.json(),
          pecaRes.json(),
        ]);

        setGraficosMoto(motoData);
        setGraficosRelatorio(relatorioData);
        setGraficosPeca(pecaData);
      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <GraficoContext.Provider
      value={{
        graficosMoto,
        graficosRelatorio,
        graficosPeca,
        loading,
        erro,
      }}
    >
      {children}
    </GraficoContext.Provider>
  );
};
