import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { ReportSection, SectionTitle } from './ReportSections';

const ReportDocument = ({ data, isEditing, onFieldChange }) => {
  return (
    <Box
      sx={{ bgcolor: '#fff', p: 4, borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
    >
      {/* 1. CAPA */}
      <ReportSection number="1" title="Capa / Cabeçalho">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="textSecondary">
              TÉCNICO RESPONSÁVEL
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                name="mecanicos"
                value={data.mecanicos || ''}
                onChange={onFieldChange}
                variant="standard"
              />
            ) : (
              <Typography variant="body2" fontWeight={600}>
                {data.mecanicos || 'Sistema'}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="textSecondary">
              DATA
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {new Date(data.created_at).toLocaleDateString('pt-BR')}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="textSecondary">
              EMPRESA
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              MotoPilot
            </Typography>
          </Grid>
        </Grid>
      </ReportSection>

      {/* 2. EQUIPAMENTO */}
      <ReportSection number="2" title="Identificação do Equipamento">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              MARCA / MODELO
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {data.moto?.marca} {data.moto?.modelo}
            </Typography>
          </Grid>
        </Grid>
      </ReportSection>

      <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

      {/* 3. OBJETIVO DO RELATÓRIO (dps deva tirar isso, n sei) */}

      <ReportSection number="3" title="Objetivo do Relatório">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Dps se tiver colocar o objetivo do relatório, ou tira essa parte n sei, mas talvez fique mt curto
            </Typography>
          </Grid>
        </Grid>
      </ReportSection>

      {/* 4. ATIVIDADES */}
      <ReportSection number="4" title="Descrição das Atividades">
        <SectionTitle title="4.1 SITUAÇÃO ENCONTRADA (DIAGNÓSTICO)" />
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            name="diagnostico"
            value={data.diagnostico || ''}
            onChange={onFieldChange}
            variant="outlined"
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ bgcolor: '#fafafa', p: 2, borderRadius: '8px', border: '1px solid #f0f0f0' }}
          >
            {data.diagnostico}
          </Typography>
        )}

        <SectionTitle title="4.2 SERVIÇOS REALIZADOS" />
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            name="atividades"
            value={data.atividades || ''}
            onChange={onFieldChange}
            variant="outlined"
          />
        ) : (
          <Typography variant="body2">{data.atividades}</Typography>
        )}

        <SectionTitle title="4.3 PEÇAS UTILIZADAS" />
        <List dense disablePadding>
          {(data.pecas || []).map((peca, idx) => (
            <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
              <ListItemText primary={`• ${peca}`} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
      </ReportSection>

      {/* 5. EVIDÊNCIAS (FOTOS) */}
        
      <ReportSection number="5" title="Evidências (Fotos)">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="textSecondary">
              Dps tem que colocar o campo de adicionar imagens
            </Typography>
          </Grid>
        </Grid>
      </ReportSection>
      {/* 6. CONCLUSÃO */}
      <ReportSection number="6" title="Conclusão e Recomendações">
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={2}
            name="observacoes"
            value={data.observacoes || ''}
            onChange={onFieldChange}
            variant="outlined"
          />
        ) : (
          <Typography variant="body2">
            {data.observacoes || 'Nenhuma observação adicional.'}
          </Typography>
        )}
      </ReportSection>

      <Grid item xs={6}>
        <Typography variant="caption" color="textSecondary">
          STATUS FINAL
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <Chip
            label="OPERACIONAL"
            icon={<CheckCircleOutline />}
            size="small"
            sx={{ bgcolor: '#212121', color: '#fff', '& .MuiChip-icon': { color: '#fff' } }}
          />
        </Box>
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center', maxWidth: '300px', mx: 'auto' }}>
        <Divider sx={{ mb: 1, borderColor: '#212121' }} />
        <Typography variant="body2" fontWeight={700}>
          {data.mecanicos || 'Técnico Responsável'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReportDocument;
