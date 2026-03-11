import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Divider } from '@mui/material';
import { Visibility, Download, DeleteOutline } from '@mui/icons-material';

const ReportCard = ({ report, onOpen, onDownload, onDelete }) => (
  <Card sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      transform: 'translateY(-4px)',
    },
  }}>
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Typography variant="caption" sx={{ color: '#9e9e9e', fontWeight: 600, letterSpacing: 1 }}>
          #{report.id}
        </Typography>
        <Chip 
          label={new Date(report.created_at).toLocaleDateString('pt-BR')} 
          size="small" 
          sx={{ backgroundColor: '#f5f5f5', color: '#616161', fontSize: '0.7rem' }} 
        />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: '#212121', mb: 0.5 }}>
        {report.moto?.modelo || 'Modelo não identificado'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#757575', mb: 2 }}>
        {report.moto?.marca}
      </Typography>

      <Typography variant="caption" sx={{ color: '#9e9e9e', display: 'block', mb: 0.5, fontWeight: 700 }}>
        DIAGNÓSTICO
      </Typography>
      <Typography variant="body2" sx={{ 
        color: '#424242', 
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: 1.6
      }}>
        {report.diagnostico}
      </Typography>
    </CardContent>

    <Divider sx={{ borderColor: '#f5f5f5' }} />
    
    <Box sx={{ p: 2, display: 'flex', gap: 1, backgroundColor: '#fafafa' }}>
      <Button 
        fullWidth 
        size="small" 
        variant="contained" 
        disableElevation
        onClick={() => onOpen(report.id)}
        sx={{ backgroundColor: '#212121', '&:hover': { backgroundColor: '#424242' }, borderRadius: '8px' }}
      >
        <Visibility sx={{ fontSize: 18, mr: 1 }} /> Ver
      </Button>
      <Button 
        size="small" 
        variant="outlined" 
        onClick={() => onDownload(report)}
        sx={{ borderColor: '#e0e0e0', color: '#616161', borderRadius: '8px', minWidth: '45px' }}
      >
        <Download sx={{ fontSize: 18 }} />
      </Button>
      <Button 
        size="small" 
        variant="outlined" 
        color="error"
        onClick={() => onDelete(report.id)}
        sx={{ borderColor: '#ffebee', borderRadius: '8px', minWidth: '45px' }}
      >
        <DeleteOutline sx={{ fontSize: 18 }} />
      </Button>
    </Box>
  </Card>
);

export default ReportCard;