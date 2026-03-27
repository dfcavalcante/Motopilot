import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  Close,
  Download,
  EditOutlined,
  SaveOutlined,
  AssignmentOutlined,
} from '@mui/icons-material';
import ReportDocument from './ReportDocument';
import { ReportContext } from '../../context/ReportContext';

const ReportDetailsDialog = ({ open, report, onClose, onDownload, onSave, watch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagemFile, setImagemFile] = useState(null);
  const { uploadImagemRelatorio } = useContext(ReportContext);

  useEffect(() => {
    if (report) {
      setFormData({ ...report });
      setIsEditing(false);
      setImagemFile(null);
    }
  }, [report, open]);

  if (!report) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Interceptar seleção de imagem para gravar o File separadamente
    if (name === 'foto') {
      setImagemFile(value); // value é um File ou null
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveInternal = async () => {
    // 1. Salvar campos de texto
    await onSave(formData);

    // 2. Se há um arquivo de imagem novo, fazer upload
    if (imagemFile instanceof File) {
      const resultado = await uploadImagemRelatorio(report.id, imagemFile);
      if (resultado) {
        setFormData((prev) => ({ ...prev, imagem_path: resultado.imagem_path }));
      }
    }

    setImagemFile(null);
    setIsEditing(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          bgcolor: '#fff',
          border: '1px solid #FEE0DF',
          boxShadow: '0 16px 38px rgba(243, 0, 0, 0.12)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          bgcolor: '#FFF7F7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #FEE0DF',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              bgcolor: '#FEDCDB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AssignmentOutlined sx={{ color: '#F30000', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#1A1A1A' }}>
            Relatório Técnico #{report.id}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={isEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={isEditing ? handleSaveInternal : () => setIsEditing(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              px: 2,
              color: '#000000',
              border: '1px solid #000000',
              bgcolor: '#fff',
              '&:hover': { bgcolor: '#FFF1F1' },
            }}
          >
            {isEditing ? 'Salvar' : 'Editar'}
          </Button>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: '#FEDCDB',
              color: '#111',
              '&:hover': { bgcolor: '#FBC8C6' },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 4 }, bgcolor: '#FFFDFD' }}>
        <ReportDocument data={formData} isEditing={isEditing} onFieldChange={handleChange} imagemFile={imagemFile} />
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: '#FFF7F7',
          borderTop: '1px solid #FEE0DF',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" sx={{ color: '#8A6A6A' }}>
          Cópia digital MotoService AI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => onDownload(report)}
            startIcon={<Download />}
            sx={{
              color: '#000000',
              border: '1px solid #000000',
              borderRadius: '10px',
              px: 2,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#FFF1F1', borderColor: '#F6A9A6' },
            }}
          >
            Exportar PDF
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#F30000',
              borderRadius: '10px',
              px: 4,
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { bgcolor: '#D80000' },
            }}
          >
            Fechar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailsDialog;
