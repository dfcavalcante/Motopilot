import { useContext, useEffect, useMemo, useState } from 'react';
import { ReportContext } from '../context/ReportContext.jsx';
import { useLogin } from '../context/LoginContext.jsx';
import generateReportPdf from '../utils/generateReportPdf.jsx';
import { notify } from '../utils/toastConfig.jsx';

export const HookHistoricoRelatorios = () => {
  const {
    relatorios,
    loading,
    erro,
    listarRelatorios,
    deletarRelatorio,
    buscarRelatorio,
    atualizarRelatorio,
    concluirRelatorio,
    watch,
  } = useContext(ReportContext);

  const { user } = useLogin();

  const [selectedReport, setSelectedReport] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [tipoOrdenacao, setTipoOrdenacao] = useState('recentes');
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    if (user?.id) {
      listarRelatorios({ cliente_id: user.id });
    }
  }, [user?.id, listarRelatorios]);

  const handleOpenDetail = async (reportId) => {
    setLoadingDetail(true);
    const relatorio = await buscarRelatorio(reportId);

    if (relatorio) {
      setSelectedReport(relatorio);
      setOpenDetail(true);
    }

    setLoadingDetail(false);
  };

  const handleDownloadPDF = async (report) => {
    console.log('🔵 PDF download - imagem_path:', report.imagem_path, '| report keys:', Object.keys(report));
    await generateReportPdf(report);
  };

  const handleSaveReport = async (updatedData) => {
    try {
      await atualizarRelatorio(updatedData.id, updatedData);

      if (user?.id) {
        await listarRelatorios({ cliente_id: user.id });
      }
    } catch (err) {
      notify.error('Erro ao salvar alterações.');
    }
  };

  const handleClickOrdernar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectOrder = (tipo) => {
    setTipoOrdenacao(tipo);
    handleCloseMenu();
  };

  const relatoriosProcessados = useMemo(() => {
    const lista = [...relatorios];

    if (tipoOrdenacao === 'antigos') {
      return lista.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    if (tipoOrdenacao === 'AZ') {
      return lista.sort((a, b) => (a.moto?.modelo || '').localeCompare(b.moto?.modelo || ''));
    }

    if (tipoOrdenacao === 'ZA') {
      return lista.sort((a, b) => (b.moto?.modelo || '').localeCompare(a.moto?.modelo || ''));
    }

    return lista.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [relatorios, tipoOrdenacao]);

  return {
    relatorios,
    relatoriosProcessados,
    loading,
    loadingDetail,
    erro,
    watch,
    selectedReport,
    openDetail,
    viewMode,
    tipoOrdenacao,
    anchorEl,
    openMenu,
    deletarRelatorio,
    concluirRelatorio,
    setOpenDetail,
    setViewMode,
    handleOpenDetail,
    handleDownloadPDF,
    handleSaveReport,
    handleClickOrdernar,
    handleCloseMenu,
    handleSelectOrder,
  };
};
