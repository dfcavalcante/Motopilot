import { createContext, useCallback, useState } from 'react';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [relatorios, setRelatorios] = useState([]);
  const [relatorioAtual, setRelatorioAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [watch, setWatch] = useState({}); // Estado para armazenar os valores assistidos
  const BASE_URL = 'http://localhost:8000';

  // Criar novo relatório
  const criarRelatorio = useCallback(
    async (dados) => {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`${BASE_URL}/relatorio/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar relatório.');
        }

        const novoRelatorio = await response.json();
        setRelatorioAtual(novoRelatorio);
        setRelatorios((prev) => [novoRelatorio, ...prev]);
        return novoRelatorio;
      } catch (error) {
        setErro(error.message);
        console.error('Erro ao criar relatório:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL]
  );

  // Listar relatórios com filtros opcionais
  const listarRelatorios = useCallback(
    async (filtros = {}) => {
      setLoading(true);
      setErro(null);
      try {
        const params = new URLSearchParams();
        if (filtros.moto_id) params.append('moto_id', filtros.moto_id);
        if (filtros.cliente_id) params.append('cliente_id', filtros.cliente_id);
        if (filtros.mecanicos) params.append('mecanicos', filtros.mecanicos);
        params.append('page', filtros.page || 1);
        params.append('per_page', filtros.per_page || 10);

        const response = await fetch(`${BASE_URL}/relatorio/?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Erro ao buscar relatórios.');
        }

        const dados = await response.json();
        setRelatorios(dados);
        return dados;
      } catch (error) {
        setErro(error.message);
        console.error('Erro ao listar relatórios:', error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL]
  );

  // Buscar relatório por ID
  const buscarRelatorio = useCallback(
    async (reportId) => {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`${BASE_URL}/relatorio/${reportId}`);

        if (!response.ok) {
          throw new Error('Relatório não encontrado.');
        }

        const dados = await response.json();
        setRelatorioAtual(dados);
        return dados;
      } catch (error) {
        setErro(error.message);
        console.error('Erro ao buscar relatório:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL]
  );

  // Atualizar relatório
  const atualizarRelatorio = useCallback(
    async (reportId, dados) => {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`${BASE_URL}/relatorio/${reportId}/atualizar`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar relatório.');
        }

        const relatorioAtualizado = await response.json();
        setRelatorios((prev) => prev.map((r) => (r.id === reportId ? relatorioAtualizado : r)));
        if (relatorioAtual?.id === reportId) {
          setRelatorioAtual(relatorioAtualizado);
        }
        return relatorioAtualizado;
      } catch (error) {
        setErro(error.message);
        console.error('Erro ao atualizar relatório:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, relatorioAtual?.id]
  );

  // Deletar relatório
  const deletarRelatorio = useCallback(
    async (reportId) => {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`${BASE_URL}/relatorio/${reportId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erro ao deletar relatório.');
        }

        setRelatorios((prev) => prev.filter((r) => r.id !== reportId));
        if (relatorioAtual?.id === reportId) {
          setRelatorioAtual(null);
        }
        return true;
      } catch (error) {
        setErro(error.message);
        console.error('Erro ao deletar relatório:', error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, relatorioAtual?.id]
  );

  // Concluir relatório (quando o gerente falar q ta tudo certo)
  const concluirRelatorio = useCallback(
    async (reportId) => {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`${BASE_URL}/relatorio/${reportId}/concluir`, {
          method: 'PATCH',
        });
        if (!response.ok) {
          throw new Error('Erro ao concluir relatório.');
        }
        const relatorioConcluido = await response.json();
        setRelatorios((prev) => prev.map((r) => (r.id === reportId ? relatorioConcluido : r)));
        if (relatorioAtual?.id === reportId) {
          setRelatorioAtual(relatorioConcluido);
        }
        return relatorioConcluido;
      } catch (error) {
        setErro(error.message);
        console.error('Erro ao concluir relatório:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [BASE_URL, relatorioAtual?.id]
  );

  return (
    <ReportContext.Provider
      value={{
        relatorios,
        relatorioAtual,
        loading,
        erro,
        criarRelatorio,
        listarRelatorios,
        buscarRelatorio,
        atualizarRelatorio,
        deletarRelatorio,
        concluirRelatorio,
        setRelatorioAtual,
        watch
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
