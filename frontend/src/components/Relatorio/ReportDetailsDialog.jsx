import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, IconButton } from '@mui/material';
import { Close, Download, EditOutlined, SaveOutlined, AssignmentOutlined } from '@mui/icons-material';
import ReportDocument from './ReportDocument';

const ReportDetailsDialog = ({ open, report, onClose, onDownload, onSave, watch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (report && !isEditing && open) {
      const draftStr = localStorage.getItem(`report_draft_${report.id}`);
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          if (draft.foto_base64) {
            draft.foto = draft.foto_base64;
          }
          setFormData(draft);
          setIsEditing(true); // Entra direto no modo de edição com o rascunho
          return;
        } catch (e) {
          console.error("Erro ao restaurar rascunho:", e);
        }
      }
      setFormData({ ...report });
    }
  }, [report, open]);

  useEffect(() => {
    if (isEditing && report?.id) {
      const saveDraft = () => {
        const draft = { ...formData };
        if (draft.foto instanceof File) {
          const reader = new FileReader();
          reader.readAsDataURL(draft.foto);
          reader.onload = () => {
            draft.foto_base64 = reader.result;
            // Remove instâncias de File para não quebrar o JSON.stringify
            delete draft.foto; 
            localStorage.setItem(`report_draft_${report.id}`, JSON.stringify(draft));
          };
        } else {
          localStorage.setItem(`report_draft_${report.id}`, JSON.stringify(draft));
        }
      };
      saveDraft();
    }
  }, [formData, isEditing, report]);

  if (!report) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveInternal = async () => {
    await onSave(formData);
    localStorage.removeItem(`report_draft_${report.id}`);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDiscard = () => {
    const confirm = window.confirm("Certeza que deseja descartar as alterações não salvas?");
    if (confirm) {
      localStorage.removeItem(`report_draft_${report.id}`);
      setFormData({ ...report });
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px', bgcolor: '#f5f5f5' } }}>
      <DialogTitle sx={{ p: 3, bgcolor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AssignmentOutlined />
          <Typography variant="h6" fontWeight={700}>Relatório Técnico #{report.id}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEditing && (
            <Button 
              onClick={handleDiscard}
              sx={{ color: '#d32f2f' }}
            >
              Descartar 
            </Button>
          )}
          <Button 
            startIcon={isEditing ? <SaveOutlined /> : <EditOutlined />} 
            onClick={isEditing ? handleSaveInternal : handleEditClick}
            sx={{ color: isEditing ? '#2e7d32' : '#212121' }}
          >
            {isEditing ? 'Salvar' : 'Editar'}
          </Button>
          <IconButton onClick={() => {
            setIsEditing(false); // Sempre reseta o estado de edição ao fechar
            onClose();
          }} size="small"><Close /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, md: 5 } }}>
        <ReportDocument data={formData} isEditing={isEditing} onFieldChange={handleChange} />
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#fff', borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="textSecondary">Cópia digital MotoService AI</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={() => onDownload(report)} startIcon={<Download />} sx={{ color: '#212121', fontWeight: 700 }}>Exportar PDF</Button>
          <Button onClick={onClose} variant="contained" disableElevation sx={{ bgcolor: '#212121', borderRadius: '8px', px: 4 }}>Fechar</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailsDialog;