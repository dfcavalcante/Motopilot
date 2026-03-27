import React from 'react';
import { Box, Grid, Typography, Divider, TextField, Chip, Button } from '@mui/material';
import { Add, CheckCircleOutline, PendingActionsOutlined, InfoOutlined } from '@mui/icons-material';
import { ReportSection, SectionTitle } from './ReportSections';
import { usePecas } from '../../context/PecasContext';
import { useEffect, useMemo, useState } from 'react';
import ReportImageUploader from './ReportImageUploader';

const normalizeStatus = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const getStatusMeta = (status) => {
  const normalized = normalizeStatus(status);

  if (normalized === 'concluido' || normalized === 'concluida') {
    return {
      label: 'Concluído',
      icon: <CheckCircleOutline />,
      bg: '#e8f5e9',
      color: '#1b5e20',
      border: '#c8e6c9',
    };
  }

  if (normalized === 'pendente') {
    return {
      label: 'Pendente',
      icon: <PendingActionsOutlined />,
      bg: '#fff8e1',
      color: '#8d6e00',
      border: '#ffecb3',
    };
  }

  return {
    label: status || 'Sem status',
    icon: <InfoOutlined />,
    bg: '#F4F4F5',
    color: '#52525B',
    border: '#E4E4E7',
  };
};

const resolveImageUrl = (path) => {
  if (!path) return null;

  const raw = String(path).trim();
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;

  const normalized = raw.replace(/\\/g, '/').replace(/^\/+/, '');
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';

  return `${protocol}//${host}:8000/${normalized}`;
};

const ReportDocument = ({ data, isEditing, onFieldChange, imagemFile }) => {
  const { pecas, adicionarPeca } = usePecas();
  const statusMeta = getStatusMeta(data?.status);
  const imagemUrl = resolveImageUrl(data?.imagem_path);

  const [pecasSelecionadas, setPecasSelecionadas] = useState([]);
  const [novaPeca, setNovaPeca] = useState('');

  const pecasDisponiveis = useMemo(() => {
    const nomesDoCatalogo = (pecas || [])
      .map((peca) => (typeof peca === 'string' ? peca : peca?.nome))
      .filter(Boolean);

    const nomesDoRelatorio = Array.isArray(data?.pecas) ? data.pecas : [];

    return [...new Set([...nomesDoCatalogo, ...nomesDoRelatorio])];
  }, [pecas, data?.pecas]);

  useEffect(() => {
    setPecasSelecionadas(Array.isArray(data?.pecas) ? data.pecas : []);
  }, [data?.pecas, data?.id]);

  const atualizarPecasNoFormulario = (novasPecas) => {
    setPecasSelecionadas(novasPecas);
    onFieldChange({
      target: {
        name: 'pecas',
        value: novasPecas,
      },
    });
  };

  const togglePeca = (peca) => {
    const novasPecas = pecasSelecionadas.includes(peca)
      ? pecasSelecionadas.filter((p) => p !== peca)
      : [...pecasSelecionadas, peca];

    atualizarPecasNoFormulario(novasPecas);
  };

  const handleAdicionar = async () => {
    const nomePeca = novaPeca.trim();
    if (!nomePeca) return;

    await adicionarPeca({ nome: nomePeca });
    if (!pecasSelecionadas.includes(nomePeca)) {
      atualizarPecasNoFormulario([...pecasSelecionadas, nomePeca]);
    }
    setNovaPeca('');
  };

  const formFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#FFF7F7',
      '& fieldset': {
        borderColor: '#FBC8C6',
      },
      '&:hover fieldset': {
        borderColor: '#F6A9A6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#F30000',
      },
    },
    '& .MuiInputBase-input': {
      color: '#1A1A1A',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#F30000',
    },
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        p: 4,
        borderRadius: '12px',
        border: '1px solid #FEE0DF',
        boxShadow: '0 8px 22px rgba(243, 0, 0, 0.08)',
      }}
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
                variant="outlined"
                size="small"
                sx={formFieldSx}
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

      {/* 3. ATIVIDADES */}
      <ReportSection number="3" title="Descrição das Atividades">
        <SectionTitle title="3.1 SITUAÇÃO ENCONTRADA (DIAGNÓSTICO)" />
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            name="diagnostico"
            value={data.diagnostico || ''}
            onChange={onFieldChange}
            variant="outlined"
            sx={formFieldSx}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ bgcolor: '#FEDCDB', p: 2, borderRadius: '8px', border: '1px solid #f0f0f0' }}
          >
            {data.diagnostico}
          </Typography>
        )}

        <Box sx={{ mt: 4 }}>
          <SectionTitle title="3.2 SERVIÇOS REALIZADOS" />
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={3}
              name="atividades"
              value={data.atividades || ''}
              onChange={onFieldChange}
              variant="outlined"
              sx={formFieldSx}
            />
          ) : (
            <Typography variant="body2">{data.atividades}</Typography>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <SectionTitle title="3.3 PEÇAS DEFEITUOSAS" />

          {isEditing ? (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {pecasDisponiveis.length > 0 ? (
                  pecasDisponiveis.map((peca) => {
                    const selecionada = pecasSelecionadas.includes(peca);
                    return (
                      <Chip
                        key={peca}
                        label={peca}
                        clickable
                        onClick={() => togglePeca(peca)}
                        variant={selecionada ? 'filled' : 'outlined'}
                        sx={{
                          borderRadius: '8px',
                          fontWeight: 600,
                          bgcolor: selecionada ? '#F30000' : '#FFF7F7',
                          color: selecionada ? '#fff' : '#6A3A3A',
                          borderColor: selecionada ? '#F30000' : '#FBC8C6',
                          '& .MuiChip-label': { px: 1.25 },
                        }}
                      />
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma peça cadastrada no catálogo.
                  </Typography>
                )}
              </Box>

              <Box
                sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}
              >
                <TextField
                  size="small"
                  label="Nova peça"
                  value={novaPeca}
                  onChange={(e) => setNovaPeca(e.target.value)}
                  sx={{ minWidth: { xs: '100%', sm: 280 }, ...formFieldSx }}
                />

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAdicionar}
                  disabled={!novaPeca.trim()}
                  sx={{
                    height: 40,
                    borderRadius: '10px',
                    px: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    bgcolor: '#F30000',
                    '&:hover': { bgcolor: '#D80000' },
                  }}
                >
                  Adicionar peça
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {pecasSelecionadas.length > 0 ? (
                pecasSelecionadas.map((peca) => (
                  <Chip
                    key={peca}
                    label={peca}
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      bgcolor: '#FEDCDB',
                      color: '#111827',
                      fontWeight: 600,
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma peça registrada
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </ReportSection>

      {/* 4. EVIDÊNCIAS (FOTOS) */}

      <ReportSection number="4" title="Evidências (Fotos)">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <ReportImageUploader
                arquivo={imagemFile || imagemUrl}
                onFileSelect={(file) => onFieldChange({ target: { name: 'foto', value: file } })}
              />
            ) : imagemUrl ? (
              <Box
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  maxHeight: 350,
                }}
              >
                <img
                  src={imagemUrl}
                  alt="Evidência do relatório"
                  style={{ width: '100%', maxHeight: 350, objectFit: 'contain', display: 'block' }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhuma imagem anexada
              </Typography>
            )}
          </Grid>
        </Grid>
      </ReportSection>

      {/* 5. CONCLUSÃO */}
      <ReportSection number="5" title="Conclusão e Recomendações">
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={2}
            name="observacoes"
            value={data.observacoes || ''}
            onChange={onFieldChange}
            variant="outlined"
            sx={formFieldSx}
          />
        ) : (
          <Typography variant="body2">
            {data.observacoes || 'Nenhuma observação adicional.'}
          </Typography>
        )}
      </ReportSection>

      <Grid item xs={12}>
        <Typography variant="caption" color="textSecondary">
          STATUS FINAL
        </Typography>
        <Box sx={{ mt: 0.75, display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={statusMeta.label}
            icon={statusMeta.icon}
            size="medium"
            sx={{
              bgcolor: statusMeta.bg,
              color: statusMeta.color,
              border: `1px solid ${statusMeta.border}`,
              fontWeight: 700,
              height: 32,
              '& .MuiChip-icon': { color: statusMeta.color },
            }}
          />
        </Box>
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center', maxWidth: '300px', mx: 'auto' }}>
        <Divider sx={{ mb: 1, borderColor: '#F30000' }} />
        <Typography variant="body2" fontWeight={700}>
          {data.mecanicos || 'Técnico Responsável'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReportDocument;
