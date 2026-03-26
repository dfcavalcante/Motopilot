import React, { useState, useEffect } from 'react';
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
import Header from './../../utils/Header';

const ReportDetailsDialog = ({ open, report, onClose, onDownload, onSave, watch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (report) {
      setFormData({ ...report });
      setIsEditing(false);
    }
  }, [report, open]);

  if (!report) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveInternal = async () => {
    await onSave(formData);
    setIsEditing(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px', bgcolor: '#f5f5f5' } }}
    >
      <DialogTitle
        sx={{
          p: 3,
          bgcolor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AssignmentOutlined />
          <Typography variant="h6" fontWeight={700}>
            Relatório Técnico #{report.id}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={isEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={isEditing ? handleSaveInternal : () => setIsEditing(true)}
            sx={{ color: isEditing ? '#2e7d32' : '#212121' }}
          >
            {isEditing ? 'Salvar' : 'Editar'}
          </Button>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 5 } }}>
        <ReportDocument data={formData} isEditing={isEditing} onFieldChange={handleChange} />
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: '#fff',
          borderTop: '1px solid #e0e0e0',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" color="textSecondary">
          Cópia digital MotoService AI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => onDownload(report)}
            startIcon={<Download />}
            sx={{ color: '#212121', fontWeight: 700 }}
          >
            Exportar PDF
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            disableElevation
            sx={{ bgcolor: '#212121', borderRadius: '8px', px: 4 }}
          >
            Fechar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailsDialog;
