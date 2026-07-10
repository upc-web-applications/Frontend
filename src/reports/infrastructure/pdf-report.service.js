import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BRAND = '#FF5B00';
const DARK   = '#0F1115';
const GRAY   = '#6B7280';

function addHeader(doc, title, subtitle) {
  doc.setFillColor(DARK);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setFontSize(18);
  doc.setTextColor(BRAND);
  doc.setFont('helvetica', 'bold');
  doc.text('RiskGuard', 14, 12);

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 20);

  doc.setFontSize(8);
  doc.setTextColor(GRAY);
  doc.text(subtitle, 14, 26);

  const now = new Date().toLocaleDateString('es-PE');
  doc.text(`Generado: ${now}`, 196, 26, { align: 'right' });

  return 38;
}

function addSectionTitle(doc, text, y) {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BRAND);
  doc.text(text, 14, y);
  doc.setDrawColor(BRAND);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 196, y + 2);
  return y + 10;
}

function addKpiRow(doc, label, value, y) {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(label, 20, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(String(value), 120, y);
  return y + 8;
}

export function generateMonthlyPDF({ month, year, incidents, kpiDashboard, annualOHSPlan, locale = 'es' }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const monthName = new Date(year, month - 1).toLocaleString(locale, { month: 'long' });

  let y = addHeader(
    doc,
    'Reporte Mensual de Gestion de SST',
    `Periodo: ${monthName} ${year} | Ley Nro. 29783 - Seguridad y Salud en el Trabajo`
  );

  // KPIs section
  y = addSectionTitle(doc, 'Indicadores Clave (KPI)', y);

  const kpiMap = {};
  kpiDashboard.forEach(k => { kpiMap[k.name] = k; });

  y = addKpiRow(doc, 'Incidentes activos', kpiMap.active_incidents?.value ?? '-', y);
  y = addKpiRow(doc, 'Incidentes resueltos en el mes', kpiMap.resolved_incidents?.value ?? '-', y);
  y = addKpiRow(doc, 'Sectores en estado critico', kpiMap.critical_sectors?.value ?? '-', y);
  y = addKpiRow(doc, 'Cumplimiento Plan SST', `${kpiMap.ohs_plan_compliance?.value ?? '-'}%`, y);

  y += 6;

  // Calculated fields (BC7: totalIncidentesPorTipo, porcentajeResolucion, tiempoPromedioResolucion, sectoresCriticos)
  const monthIncidents = incidents.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const totalPorTipo = monthIncidents.reduce((acc, i) => {
    const t = i.incident_type || 'Sin tipo';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const resolved = monthIncidents.filter(i => i.resolved);
  const porcentajeResolucion = monthIncidents.length
    ? Math.round((resolved.length / monthIncidents.length) * 100)
    : 0;

  const withTime = monthIncidents.filter(i => i.resolution_time_hours != null);
  const tiempoPromedioResolucion = withTime.length
    ? Math.round(withTime.reduce((s, i) => s + i.resolution_time_hours, 0) / withTime.length)
    : 0;

  const sectorSet = new Set(monthIncidents.map(i => i.section || i.sector).filter(Boolean));
  const sectoresCriticos = (annualOHSPlan?.details_by_sector || [])
    .filter(s => s.compliance < 50 && sectorSet.has(s.sector))
    .map(s => s.sector);

  y = addSectionTitle(doc, 'Analisis del Periodo', y);

  if (Object.keys(totalPorTipo).length) {
    autoTable(doc, {
      startY: y,
      head: [['Tipo de Incidente', 'Cantidad']],
      body: Object.entries(totalPorTipo).map(([tipo, cnt]) => [tipo, cnt]),
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 100 },
      theme: 'striped'
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  y = addKpiRow(doc, 'Porcentaje de resolucion', `${porcentajeResolucion}%`, y);
  y = addKpiRow(doc, 'Tiempo prom. resolucion', tiempoPromedioResolucion ? `${tiempoPromedioResolucion} hrs` : '-', y);
  y = addKpiRow(doc, 'Sectores criticos del periodo',
    sectoresCriticos.length ? sectoresCriticos.join(', ') : 'Ninguno', y);
  y += 8;

  y = addSectionTitle(doc, 'Registro de Incidentes del Periodo', y);

  if (monthIncidents.length === 0) {
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text('No se registraron incidentes para el periodo seleccionado.', 20, y);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      head: [['ID', 'Fecha', 'Sector', 'Tipo', 'Estado']],
      body: monthIncidents.map(i => [
        i.id,
        new Date(i.date).toLocaleDateString('es-PE'),
        i.section || i.sector || '-',
        i.incident_type || '-',
        i.resolved ? 'Resuelto' : 'Pendiente'
      ]),
      headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      theme: 'striped'
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // OHS Plan section
  if (annualOHSPlan) {
    y = addSectionTitle(doc, 'Cumplimiento Plan Anual SST', y);

    const rows = (annualOHSPlan.monthly_details || []).map(m => [
      new Date(year, m.month - 1).toLocaleString(locale, { month: 'long' }),
      `${m.compliance}%`,
      m.completed_activities,
      m.planned_activities,
      m.status === 'optimal' ? 'Optimo' : m.status === 'acceptable' ? 'Aceptable' : 'Critico'
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Mes', 'Cumplimiento', 'Completadas', 'Planificadas', 'Estado']],
      body: rows,
      headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      theme: 'striped'
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(GRAY);
    doc.text(`Pagina ${p} de ${pageCount} - Documento generado por RiskGuard`, 105, 290, { align: 'center' });
  }

  return doc;
}

export function generateAuditPDF({ dateFrom, dateTo, incidents, annualOHSPlan }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const fromStr = new Date(dateFrom).toLocaleDateString('es-PE');
  const toStr   = new Date(dateTo).toLocaleDateString('es-PE');

  let y = addHeader(
    doc,
    'Formato de Auditoria SUNAFIL - Ley Nro. 29783',
    `Rango: ${fromStr} al ${toStr}`
  );

  y = addSectionTitle(doc, 'Datos del Centro de Trabajo', y);
  y = addKpiRow(doc, 'Razon social', 'RiskGuard S.A.C.', y);
  y = addKpiRow(doc, 'RUC', '20123456789', y);
  y = addKpiRow(doc, 'Actividad economica', 'Gestion de Seguridad Industrial', y);
  y += 6;

  // Filter incidents by date range
  const from = new Date(dateFrom);
  const to   = new Date(dateTo);
  const filtered = incidents.filter(i => {
    const d = new Date(i.date);
    return d >= from && d <= to;
  });

  y = addSectionTitle(doc, 'Registro de Incidentes y Accidentes (Art. 28 - Ley 29783)', y);

  if (filtered.length === 0) {
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text('No se registraron incidentes para el rango de fechas seleccionado.', 20, y);
    y += 10;
  } else {
    autoTable(doc, {
      startY: y,
      head: [['Nro.', 'Fecha', 'Sector / Area', 'Tipo de incidente', 'Descripcion', 'Estado', 'Hrs. resolucion']],
      body: filtered.map((i, idx) => [
        idx + 1,
        new Date(i.date).toLocaleDateString('es-PE'),
        i.section || i.sector || '-',
        i.incident_type || '-',
        (i.description || '').substring(0, 40),
        i.resolved ? 'Resuelto' : 'Pendiente',
        i.resolution_time_hours ?? '-'
      ]),
      headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 7 },
      bodyStyles: { fontSize: 7, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      columnStyles: { 4: { cellWidth: 40 } },
      theme: 'striped'
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // OHS compliance
  if (annualOHSPlan) {
    y = addSectionTitle(doc, 'Cumplimiento del Plan de SST (Art. 38 - Ley 29783)', y);
    y = addKpiRow(doc, 'Cumplimiento global', `${annualOHSPlan.global_compliance}%`, y);
    y = addKpiRow(doc, 'Meta establecida', `${annualOHSPlan.goal}%`, y);
    y = addKpiRow(doc, 'Actividades completadas', `${annualOHSPlan.completed_activities} / ${annualOHSPlan.total_activities}`, y);
    y = addKpiRow(doc, 'Meses criticos', annualOHSPlan.critical_months, y);
    y += 10;

    const sectorRows = (annualOHSPlan.details_by_sector || []).map(s => [
      s.sector,
      `${s.compliance}%`,
      s.completed_activities,
      s.planned_activities,
      s.compliance >= 80 ? 'Cumple' : 'No cumple'
    ]);

    if (sectorRows.length) {
      autoTable(doc, {
        startY: y,
        head: [['Sector', 'Cumplimiento', 'Completadas', 'Planificadas', 'Resultado']],
        body: sectorRows,
        headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        theme: 'striped'
      });
    }
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(GRAY);
    doc.text(`Pagina ${p} de ${pageCount} - Documento generado por RiskGuard`, 105, 290, { align: 'center' });
  }

  return doc;
}

export function generateCompliancePDF({ sectorFilter, annualOHSPlan, kpiDashboard, incidents }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const sectorLabel = sectorFilter || 'Todos los sectores';
  let y = addHeader(
    doc,
    'Reporte de Cumplimiento Normativo',
    `Sector: ${sectorLabel} | Ley Nro. 29783`
  );

  y = addSectionTitle(doc, 'Indicadores de Cumplimiento', y);

  const kpiMap = {};
  kpiDashboard.forEach(k => { kpiMap[k.name] = k; });

  y = addKpiRow(doc, 'Cumplimiento Plan SST global', `${kpiMap.ohs_plan_compliance?.value ?? '-'}%`, y);
  y = addKpiRow(doc, 'Meta Plan SST', `${kpiMap.ohs_plan_compliance?.goal ?? 80}%`, y);
  y += 6;

  // Sector detail
  if (annualOHSPlan) {
    y = addSectionTitle(doc, 'Detalle por Sector', y);

    const sectors = sectorFilter
      ? (annualOHSPlan.details_by_sector || []).filter(s => s.sector === sectorFilter)
      : (annualOHSPlan.details_by_sector || []);

    if (sectors.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(GRAY);
      doc.text('No hay datos de cumplimiento para el sector seleccionado.', 20, y);
      y += 10;
    } else {
      autoTable(doc, {
        startY: y,
        head: [['Sector', 'Cumplimiento', 'Actividades completadas', 'Actividades planificadas', 'Estado']],
        body: sectors.map(s => [
          s.sector,
          `${s.compliance}%`,
          s.completed_activities,
          s.planned_activities,
          s.compliance >= 80 ? 'Optimo' : s.compliance >= 50 ? 'Aceptable' : 'Critico'
        ]),
        headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        theme: 'striped'
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  }

  // Incidents for sector
  const filteredIncidents = sectorFilter
    ? incidents.filter(i => (i.section || i.sector) === sectorFilter)
    : incidents;

  y = addSectionTitle(doc, 'Incidentes Registrados', y);

  if (filteredIncidents.length === 0) {
    doc.setFontSize(9);
    doc.setTextColor(GRAY);
    doc.text('No se encontraron incidentes para el sector seleccionado.', 20, y);
  } else {
    autoTable(doc, {
      startY: y,
      head: [['Fecha', 'Sector', 'Tipo', 'Estado', 'Hrs. resolucion']],
      body: filteredIncidents.map(i => [
        new Date(i.date).toLocaleDateString('es-PE'),
        i.section || i.sector || '-',
        i.incident_type || '-',
        i.resolved ? 'Resuelto' : 'Pendiente',
        i.resolution_time_hours ?? '-'
      ]),
      headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      theme: 'striped'
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(GRAY);
    doc.text(`Pagina ${p} de ${pageCount} - Documento generado por RiskGuard`, 105, 290, { align: 'center' });
  }

  return doc;
}

export function generateExecutiveSummaryPDF({ predictiveIndicators, kpiDashboard, date }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const dateStr = new Date(date).toLocaleDateString('es-PE');
  let y = addHeader(
    doc,
    'Resumen Ejecutivo - Indicadores Predictivos de Riesgo',
    `Generado al: ${dateStr}`
  );

  y = addSectionTitle(doc, 'Indicadores Clave del Dashboard', y);
  const kpiMap = {};
  kpiDashboard.forEach(k => { kpiMap[k.name] = k; });

  y = addKpiRow(doc, 'Incidentes activos', kpiMap.active_incidents?.value ?? '-', y);
  y = addKpiRow(doc, 'Incidentes resueltos en el mes', kpiMap.resolved_incidents?.value ?? '-', y);
  y = addKpiRow(doc, 'Sectores criticos', kpiMap.critical_sectors?.value ?? '-', y);
  y = addKpiRow(doc, 'Cumplimiento Plan SST', `${kpiMap.ohs_plan_compliance?.value ?? '-'}%`, y);
  y += 6;

  predictiveIndicators.forEach((ind, idx) => {
    y = addSectionTitle(doc, `Analisis Predictivo - Periodo ${ind.period_days} dias`, y);
    y = addKpiRow(doc, 'Total incidentes', ind.total_incidents, y);
    y = addKpiRow(doc, 'Variacion vs. mes anterior', `${ind.previous_month_variation}%`, y);
    y = addKpiRow(doc, 'Tiempo promedio resolucion', `${ind.average_resolution_time_hours} hrs`, y);
    y = addKpiRow(doc, 'Meta de resolucion', `${ind.resolution_goal_hours} hrs`, y);
    y += 4;

    if (ind.sectors_with_increasing_trend?.length) {
      autoTable(doc, {
        startY: y,
        head: [['Sector en tendencia creciente', 'Eventos', 'Variacion %', 'Estado']],
        body: ind.sectors_with_increasing_trend.map(s => [
          s.sector, s.events, `${s.variation_percentage}%`,
          s.status === 'critical' ? 'CRITICO' : 'ALERTA'
        ]),
        headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        theme: 'striped'
      });
      y = doc.lastAutoTable.finalY + 8;
    }

    if (ind.recurring_incident_types?.length) {
      autoTable(doc, {
        startY: y,
        head: [['Tipo recurrente', 'Cantidad', 'Porcentaje', 'Tendencia']],
        body: ind.recurring_incident_types.map(r => [
          r.type, r.count, `${r.percentage}%`, r.trend
        ]),
        headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        theme: 'striped'
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (idx < predictiveIndicators.length - 1 && y > 220) {
      doc.addPage();
      y = 20;
    }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(GRAY);
    doc.text(`Pagina ${p} de ${pageCount} - Documento generado por RiskGuard`, 105, 290, { align: 'center' });
  }

  return doc;
}

export function pdfToBlob(doc) {
  return doc.output('blob');
}

export function downloadPDF(doc, filename) {
  doc.save(filename);
}
