import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, CircularProgress, Alert } from '@mui/material';
import BaseFront from '../utils/BaseFront';
import { ReportContext } from '../context/ReportContext.jsx';
import { useLogin } from '../context/LoginContext.jsx';
import ReportCard from '../components/Relatorio/ReportCard.jsx';
import ReportDetailsDialog from '../components/Relatorio/ReportDetailsDialog.jsx';

const HistoricoRelatorios = () => {
  const {
    relatorios,
    loading,
    erro,
    listarRelatorios,
    deletarRelatorio,
    buscarRelatorio,
    atualizarRelatorio,
    concluirRelatorio,
    watch
  } = useContext(ReportContext);
  const { user } = useLogin();

  const [selectedReport, setSelectedReport] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (user?.id) listarRelatorios({ cliente_id: user.id });
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

  const handleDownloadPDF = (report) => {
    console.log('Downloading...', report);
    alert('PDF em fase de processamento.');
    //um dia eu impleplemento
  };

  const handleSaveReport = async (updatedData) => {
    try {
      // Chamada para API através do Contexto
      await atualizarRelatorio(updatedData.id, updatedData);
      // Opcional: Recarregar a lista ou atualizar o estado local
      listarRelatorios({ cliente_id: user.id });
    } catch (err) {
      alert('Erro ao salvar alterações.');
    }
  };

  return (
    <BaseFront nome="Histórico de Relatórios">
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
        {erro && (
          <Alert severity="error" variant="outlined" sx={{ mb: 4, borderRadius: '12px' }}>
            {erro}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: '#212121' }} />
          </Box>
        ) : relatorios.length === 0 ? (
          <Alert
            severity="info"
            variant="outlined"
            sx={{ borderRadius: '12px', borderStyle: 'dashed' }}
          >
            Nenhum relatório encontrado. Finalize um atendimento para gerar seu primeiro relatório!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {relatorios.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <ReportCard
                  report={report}
                  onOpen={handleOpenDetail}
                  onDownload={handleDownloadPDF}
                  onDelete={deletarRelatorio}
                  onConclude={concluirRelatorio}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <ReportDetailsDialog
          open={openDetail}
          report={selectedReport}
          onClose={() => setOpenDetail(false)}
          onDownload={handleDownloadPDF}
          onSave={handleSaveReport}
          watch={watch}
        />
      </Box>
    </BaseFront>
  );
};

export default HistoricoRelatorios;
