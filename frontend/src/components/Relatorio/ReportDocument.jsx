import React from 'react';
import { Box, Grid, Typography, Divider, TextField, Chip, Button } from '@mui/material';
import { Add, CheckCircleOutline } from '@mui/icons-material';
import { ReportSection, SectionTitle } from './ReportSections';
import { usePecas } from '../../context/PecasContext';
import { useEffect, useMemo, useState } from 'react';
import ReportImageUploader from './ReportImageUploader';

const ReportDocument = ({ data, isEditing, onFieldChange }) => {
  const { pecas, adicionarPeca } = usePecas();

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
              Dps se tiver colocar o objetivo do relatório, ou tira essa parte n sei, mas talvez
              fique mt curto
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

        <SectionTitle title="4.3 PEÇAS DEFEITUOSAS" />

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
                      color={selecionada ? 'primary' : 'default'}
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
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

            <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                label="Nova peça"
                value={novaPeca}
                onChange={(e) => setNovaPeca(e.target.value)}
                sx={{ minWidth: { xs: '100%', sm: 280 } }}
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
                  bgcolor: '#0f172a',
                  '&:hover': { bgcolor: '#111827' },
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
                    bgcolor: '#f3f4f6',
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
      </ReportSection>

      {/* 5. EVIDÊNCIAS (FOTOS) */}

      <ReportSection number="5" title="Evidências (Fotos)">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ReportImageUploader
              arquivo={data.foto}
              onFileSelect={(file) => onFieldChange({ target: { name: 'foto', value: file } })}
            />

            {/*Tem que coisar o backend pra suportar múltiplas fotos*/}
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              sx={{
                mt: 1,
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                borderColor: '#0f172a',
                color: '#0f172a',
                '&:hover': { borderColor: '#111827', color: '#111827' },
              }}
            > Adicionar mais imagens </Button>
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
