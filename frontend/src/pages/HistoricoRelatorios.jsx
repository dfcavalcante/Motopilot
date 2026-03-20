import React from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import BaseFront from '../utils/BaseFront';
import ReportCard from '../components/Relatorio/ReportCard.jsx';
import ReportDetailsDialog from '../components/Relatorio/ReportDetailsDialog.jsx';
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
      <Box display="flex" alignItems="center" mt={1} sx={{ width: '100%', px: 2 }}>
        <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} ml={9}>
            <Typography sx={{ fontWeight: '500', whiteSpace: 'nowrap' }}>Visualização</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() => setViewMode('grid')}
                sx={{
                  border: viewMode === 'grid' ? '1px solid #666' : '1px solid #E0E0E0',
                  borderRadius: '4px',
                  width: '24px',
                  height: '24px',
                }}
              >
                <img src="/images/Organizar1.png" alt="Grid" height={14} />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                sx={{
                  border: viewMode === 'list' ? '1px solid #666' : '1px solid #a5a5a5',
                  borderRadius: '4px',
                  width: '24px',
                  height: '24px',
                }}
              >
                <img src="/images/Organizar2.png" alt="List" height={14} />
              </IconButton>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography sx={{ fontWeight: '500', color: 'grey.900' }}>Ordenar</Typography>
            <IconButton
              onClick={handleClickOrdernar}
              sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: '1px solid #E0E0E0',
                backgroundColor: 'white',
              }}
            >
              <img src="/images/linhaPraBaixo.png" alt="Ordenar" style={{ width: '10px' }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
              <MenuItem onClick={() => handleSelectOrder('recentes')}>Mais recentes</MenuItem>
              <MenuItem onClick={() => handleSelectOrder('antigos')}>Mais antigos</MenuItem>
              <MenuItem onClick={() => handleSelectOrder('AZ')}>Modelo A - Z</MenuItem>
              <MenuItem onClick={() => handleSelectOrder('ZA')}>Modelo Z - A</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Caixa Cinza Principal Unificada */}
      <Box
        backgroundColor="#DBDBDB"
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
