import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import BaseFront from '../utils/BaseFront';
import ReportCard from '../components/Relatorio/ReportCard.jsx';
import ReportDetailsDialog from '../components/Relatorio/ReportDetailsDialog.jsx';
import ReportControlsBar from '../components/Relatorio/ReportControlsBar.jsx';
import { HookHistoricoRelatorios } from '../hooks/HookHistoricoRelatorios.jsx';

const HistoricoRelatorios = () => {
  const {
    relatorios,
    relatoriosProcessados,
    loading,
    erro,
    deletarRelatorio,
    concluirRelatorio,
    watch,
    selectedReport,
    openDetail,
    viewMode,
    anchorEl,
    openMenu,
    setOpenDetail,
    setViewMode,
    handleOpenDetail,
    handleDownloadPDF,
    handleSaveReport,
    handleClickOrdernar,
    handleCloseMenu,
    handleSelectOrder,
  } = HookHistoricoRelatorios();

  return (
    <BaseFront nome="Histórico de Relatórios">
      <ReportControlsBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleClickOrdernar={handleClickOrdernar}
        anchorEl={anchorEl}
        openMenu={openMenu}
        handleCloseMenu={handleCloseMenu}
        handleSelectOrder={handleSelectOrder}
      />

      {/* Caixa Cinza Principal Unificada */}
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          borderRadius: '16px',
          p: { xs: 3, md: 4 },
          mt: 2,
          overflowY: 'auto',
          minHeight: '60vh',
        }}
      >
        <Box sx={{ margin: '0 auto' }}>
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
              sx={{ borderRadius: '12px', borderStyle: 'dashed', backgroundColor: '#fff' }}
            >
              Nenhum relatório encontrado. Finalize um atendimento para gerar seu primeiro
              relatório!
            </Alert>
          ) : (
            <Box
              sx={{
                ...(viewMode === 'grid'
                  ? {
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                      },
                      gap: 3,
                      alignItems: 'stretch',
                      width: '100%',
                    }
                  : {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      width: '100%',
                    }),
              }}
            >
              {relatoriosProcessados.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onOpen={handleOpenDetail}
                  onDownload={handleDownloadPDF}
                  onDelete={deletarRelatorio}
                  onConclude={concluirRelatorio}
                  compactActions={viewMode === 'list'}
                />
              ))}
            </Box>
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
      </Box>
    </BaseFront>
  );
};

export default HistoricoRelatorios;
