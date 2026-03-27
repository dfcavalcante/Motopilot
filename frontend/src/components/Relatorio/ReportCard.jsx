import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility, Download, DeleteOutline, Check } from '@mui/icons-material';

const normalizeStatus = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const ReportCard = ({
  report,
  onOpen,
  onDownload,
  onDelete,
  onConclude,
  compactActions = false,
}) => {
  const statusNormalizado = normalizeStatus(report?.status);
  const isConcluido = statusNormalizado === 'concluido' || statusNormalizado === 'concluida';

  return (
    <Card
      sx={{
        height: compactActions ? 'auto' : '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: isConcluido ? '0 6px 16px rgba(46,125,50,0.10)' : '0 4px 12px rgba(0,0,0,0.03)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: isConcluido
            ? '0 10px 24px rgba(46,125,50,0.14)'
            : '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: compactActions ? 2 : 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={compactActions ? 1 : 2}
        >
          <Typography
            variant="caption"
            sx={{ color: '#000000', fontWeight: 600, letterSpacing: 1 }}
          >
            #{report.id}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.75}>
            <Chip
              label={isConcluido ? 'Concluído' : 'Pendente'}
              size="small"
              sx={{
                backgroundColor: isConcluido ? '#e8f5e9' : '#fff8e1',
                color: isConcluido ? '#1b5e20' : '#8d6e00',
                border: isConcluido ? '1px solid #c8e6c9' : '1px solid #ffecb3',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            />
            <Chip
              label={new Date(report.created_at).toLocaleDateString('pt-BR')}
              size="small"
              sx={{
                backgroundColor: '#f5f5f5',
                color: '#616161',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#212121',
            mb: 0.3,
            lineHeight: 1.2,
            fontSize: compactActions ? '1rem' : '1.25rem',
          }}
        >
          {report.moto?.modelo || 'Modelo não identificado'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#757575', mb: compactActions ? 1 : 2 }}>
          {report.moto?.marca || 'Marca não informada'}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: '#a8332f', display: 'block', mb: 0.5, fontWeight: 700 }}
        >
          DIAGNÓSTICO
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#424242',
            display: '-webkit-box',
            WebkitLineClamp: compactActions ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: compactActions ? 1.45 : 1.6,
          }}
        >
          {report.diagnostico || 'Nenhum diagnóstico registrado.'}
        </Typography>

        {compactActions && (
          <Box
            sx={{
              mt: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 0.5,
            }}
          >
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={() => onOpen(report.id)}
              sx={{
                minWidth: 120,
                height: 30,
                px: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                color: 'white',
                backgroundColor: '#F30000',
                border: '1px solid #F30000',
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#F30000' },
              }}
            >
              <Visibility sx={{ fontSize: 18, mr: 1 }} /> Ver
            </Button>

            <Tooltip title="Baixar PDF">
              <IconButton
                size="small"
                onClick={() => onDownload(report)}
                sx={{ border: '1px solid #e0e0e0', color: '#616161', borderRadius: '8px' }}
              >
                <Download sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Excluir">
              <IconButton
                size="small"
                onClick={() => onDelete(report.id)}
                sx={{ border: '1px solid #ffebee', color: '#616161', borderRadius: '8px' }}
              >
                <DeleteOutline sx={{ fontSize: 18, color: '#000000' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={isConcluido ? 'Relatório já concluído' : 'Concluir'}>
              <IconButton
                size="small"
                color="success"
                onClick={() => onConclude(report.id)}
                disabled={isConcluido}
                sx={{ border: '1px solid #e8f5e9', color: '#2e7d32', borderRadius: '8px' }}
              >
                <Check sx={{ fontSize: 18, color: '#000000' }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardContent>

      {!compactActions && (
        <>
          <Divider sx={{ borderColor: '#f5f5f5' }} />

          {/* Barra de Ações */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              backgroundColor: '#fafafa',
            }}
          >
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={() => onOpen(report.id)}
              sx={{
                flexGrow: 1,
                backgroundColor: '#F30000',
                '&:hover': { backgroundColor: '#F30000' },
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              <Visibility sx={{ fontSize: 18, mr: 1 }} /> Ver
            </Button>

            <Box display="flex" gap={0.5}>
              <Tooltip title="Baixar PDF">
                <IconButton
                  size="small"
                  onClick={() => onDownload(report)}
                  sx={{ border: '1px solid #e0e0e0', color: '#616161', borderRadius: '8px' }}
                >
                  <Download sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Excluir">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(report.id)}
                  sx={{ border: '1px solid #ffebee', borderRadius: '8px' }}
                >
                  <DeleteOutline sx={{ fontSize: 18, color: '#000000' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title={isConcluido ? 'Relatório já concluído' : 'Concluir'}>
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => onConclude(report.id)}
                  disabled={isConcluido}
                  sx={{ border: '1px solid #e8f5e9', color: '#2e7d32', borderRadius: '8px' }}
                >
                  <Check sx={{ fontSize: 18, color: '#000000' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
};

export default ReportCard;
