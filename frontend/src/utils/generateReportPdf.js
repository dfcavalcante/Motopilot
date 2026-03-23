import { jsPDF } from 'jspdf';

/**
 * Gera e baixa o PDF de um relatório de manutenção.
 * @param {object} report - O objeto completo do relatório (ReportResponse).
 */
export default function generateReportPdf(report) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 20;
  const marginRight = 20;
  const contentWidth = pageWidth - marginLeft - marginRight;
  let y = 20;

  const dataFormatada = report.created_at
    ? new Date(report.created_at).toLocaleDateString('pt-BR')
    : '—';

  // ─── Cores ───
  const accent = [33, 33, 33];       // #212121
  const gray = [117, 117, 117];      // #757575
  const lightGray = [224, 224, 224]; // #e0e0e0

  // ─── Helpers ───
  function checkPageBreak(needed) {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
  }

  function drawSectionTitle(number, title) {
    checkPageBreak(14);
    doc.setFillColor(...accent);
    doc.roundedRect(marginLeft, y, contentWidth, 10, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`${number}. ${title}`, marginLeft + 4, y + 7);
    y += 14;
  }

  function drawLabel(label) {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text(label.toUpperCase(), marginLeft, y);
    y += 4;
  }

  function drawValue(value, opts = {}) {
    const text = value || '—';
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(opts.size || 10);
    doc.setTextColor(...accent);
    const lines = doc.splitTextToSize(text, contentWidth - (opts.indent || 0));
    checkPageBreak(lines.length * 5 + 2);
    doc.text(lines, marginLeft + (opts.indent || 0), y);
    y += lines.length * 5 + 2;
  }

  function drawSubSectionTitle(title) {
    checkPageBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...accent);
    doc.text(title, marginLeft, y);
    y += 6;
  }

  function drawDivider() {
    checkPageBreak(6);
    doc.setDrawColor(...lightGray);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(marginLeft, y, pageWidth - marginRight, y);
    doc.setLineDashPattern([], 0);
    y += 6;
  }

  // ═══════════════════════════════════════════════════
  //  CABEÇALHO
  // ═══════════════════════════════════════════════════
  doc.setFillColor(...accent);
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('MotoPilot', marginLeft, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Relatório de Manutenção', marginLeft, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`#${report.id}`, pageWidth - marginRight, 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(dataFormatada, pageWidth - marginRight, 24, { align: 'right' });

  y = 44;

  // ═══════════════════════════════════════════════════
  //  1. CAPA / CABEÇALHO
  // ═══════════════════════════════════════════════════
  drawSectionTitle('1', 'Capa / Cabeçalho');

  drawLabel('Técnico Responsável');
  drawValue(report.mecanicos, { bold: true });

  drawLabel('Data');
  drawValue(dataFormatada, { bold: true });

  drawLabel('Empresa');
  drawValue('MotoPilot', { bold: true });

  drawDivider();

  // ═══════════════════════════════════════════════════
  //  2. IDENTIFICAÇÃO DO EQUIPAMENTO
  // ═══════════════════════════════════════════════════
  drawSectionTitle('2', 'Identificação do Equipamento');

  drawLabel('Marca / Modelo');
  const motoInfo = report.moto
    ? `${report.moto.marca || ''} ${report.moto.modelo || ''}`.trim()
    : 'Não identificado';
  drawValue(motoInfo, { bold: true });

  if (report.moto?.ano) {
    drawLabel('Ano');
    drawValue(String(report.moto.ano), { bold: true });
  }

  drawDivider();

  // ═══════════════════════════════════════════════════
  //  3. DESCRIÇÃO DAS ATIVIDADES
  // ═══════════════════════════════════════════════════
  drawSectionTitle('3', 'Descrição das Atividades');

  drawSubSectionTitle('3.1 Situação Encontrada (Diagnóstico)');
  drawValue(report.diagnostico);

  drawSubSectionTitle('3.2 Serviços Realizados');
  drawValue(report.atividades);

  drawSubSectionTitle('3.3 Peças Defeituosas / Substituídas');
  const pecasLista = Array.isArray(report.pecas)
    ? report.pecas
    : typeof report.pecas === 'string' && report.pecas
      ? report.pecas.split(',').map((p) => p.trim())
      : [];

  if (pecasLista.length > 0) {
    pecasLista.forEach((peca, i) => {
      drawValue(`• ${peca}`, { indent: 4 });
    });
  } else {
    drawValue('Nenhuma peça registrada.');
  }

  drawDivider();

  // ═══════════════════════════════════════════════════
  //  4. CONCLUSÃO E RECOMENDAÇÕES
  // ═══════════════════════════════════════════════════
  drawSectionTitle('4', 'Conclusão e Recomendações');
  drawValue(report.observacoes || 'Nenhuma observação adicional.');

  drawDivider();

  // ═══════════════════════════════════════════════════
  //  ASSINATURA
  // ═══════════════════════════════════════════════════
  checkPageBreak(30);
  y += 10;
  const sigX = pageWidth / 2;
  doc.setDrawColor(...accent);
  doc.setLineDashPattern([], 0);
  doc.line(sigX - 40, y, sigX + 40, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...accent);
  doc.text(report.mecanicos || 'Técnico Responsável', sigX, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text('Técnico Responsável', sigX, y, { align: 'center' });

  // ═══════════════════════════════════════════════════
  //  RODAPÉ
  // ═══════════════════════════════════════════════════
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...gray);
  doc.text('Cópia digital — MotoPilot', marginLeft, pageH - 10);
  doc.text(dataFormatada, pageWidth - marginRight, pageH - 10, { align: 'right' });

  // ─── Salvar ───
  const nomeArquivo = `Relatorio_${report.id}_${dataFormatada.replace(/\//g, '-')}.pdf`;
  doc.save(nomeArquivo);
}
