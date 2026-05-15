import * as XLSX from 'xlsx';

function saveWorkbook(wb, fileName) {
  XLSX.writeFile(wb, fileName);
}

function addHeaderSheet(wb, title, meta) {
  const rows = [
    ['RiskGuard — ' + title],
    [],
    ...meta.map(([k, v]) => [k, v]),
    []
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 30 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Portada');
}

export function generateMonthlyExcel({ month, year, incidents, kpiDashboard, annualOHSPlan, locale = 'es' }) {
  const wb = XLSX.utils.book_new();
  const monthName = new Date(year, month - 1).toLocaleString(locale, { month: 'long' });

  addHeaderSheet(wb, 'Reporte Mensual de SST', [
    ['Período', `${monthName} ${year}`],
    ['Generado', new Date().toLocaleDateString('es-PE')],
    ['Ley aplicable', 'N° 29783 — Seguridad y Salud en el Trabajo']
  ]);

  // KPIs
  const kpiMap = {};
  kpiDashboard.forEach(k => { kpiMap[k.name] = k; });

  const kpiRows = [
    ['Indicador', 'Valor', 'Meta', 'Estado'],
    ['Incidentes Activos',         kpiMap.active_incidents?.value ?? '—',     kpiMap.active_incidents?.goal ?? '—',     kpiMap.active_incidents?.status ?? '—'],
    ['Incidentes Resueltos',       kpiMap.resolved_incidents?.value ?? '—',   kpiMap.resolved_incidents?.goal ?? '—',   kpiMap.resolved_incidents?.status ?? '—'],
    ['Sectores Críticos',          kpiMap.critical_sectors?.value ?? '—',     kpiMap.critical_sectors?.goal ?? '—',     kpiMap.critical_sectors?.status ?? '—'],
    ['Cumplimiento Plan SST (%)',  kpiMap.ohs_plan_compliance?.value ?? '—',  kpiMap.ohs_plan_compliance?.goal ?? '—',  kpiMap.ohs_plan_compliance?.status ?? '—']
  ];
  const wsKPI = XLSX.utils.aoa_to_sheet(kpiRows);
  wsKPI['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsKPI, 'KPIs');

  // Incidents
  const monthIncidents = incidents.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const incRows = [
    ['ID', 'Fecha', 'Sector', 'Tipo de Incidente', 'Descripción', 'Estado', 'Hrs. Resolución'],
    ...monthIncidents.map(i => [
      i.id,
      new Date(i.date).toLocaleDateString('es-PE'),
      i.section || i.sector || '—',
      i.incident_type || '—',
      i.description || '—',
      i.resolved ? 'Resuelto' : 'Pendiente',
      i.resolution_time_hours ?? '—'
    ])
  ];
  const wsInc = XLSX.utils.aoa_to_sheet(incRows);
  wsInc['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 22 }, { wch: 40 }, { wch: 12 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsInc, 'Incidentes');

  // OHS Plan monthly
  if (annualOHSPlan?.monthly_details?.length) {
    const planRows = [
      ['Mes', 'Cumplimiento (%)', 'Actividades Completadas', 'Actividades Planificadas', 'Estado'],
      ...annualOHSPlan.monthly_details.map(m => [
        new Date(year, m.month - 1).toLocaleString(locale, { month: 'long' }),
        m.compliance,
        m.completed_activities,
        m.planned_activities,
        m.status === 'optimal' ? 'Óptimo' : m.status === 'acceptable' ? 'Aceptable' : 'Crítico'
      ])
    ];
    const wsPlan = XLSX.utils.aoa_to_sheet(planRows);
    wsPlan['!cols'] = [{ wch: 16 }, { wch: 18 }, { wch: 24 }, { wch: 24 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsPlan, 'Plan SST');
  }

  const fileName = `RiskGuard_Reporte_Mensual_${monthName}_${year}.xlsx`;
  saveWorkbook(wb, fileName);
  return fileName;
}

export function generateAuditExcel({ dateFrom, dateTo, incidents, annualOHSPlan }) {
  const wb = XLSX.utils.book_new();
  const fromStr = new Date(dateFrom).toLocaleDateString('es-PE');
  const toStr   = new Date(dateTo).toLocaleDateString('es-PE');

  addHeaderSheet(wb, 'Formato de Auditoría SUNAFIL', [
    ['Rango de fechas', `${fromStr} al ${toStr}`],
    ['Generado', new Date().toLocaleDateString('es-PE')],
    ['Ley aplicable', 'N° 29783 — Art. 28 y 38'],
    ['Razón social', 'RiskGuard S.A.C.'],
    ['RUC', '20123456789']
  ]);

  const from = new Date(dateFrom);
  const to   = new Date(dateTo);
  const filtered = incidents.filter(i => {
    const d = new Date(i.date);
    return d >= from && d <= to;
  });

  const incRows = [
    ['N°', 'Fecha', 'Sector / Área', 'Tipo de Incidente', 'Descripción', 'Estado Final', 'Hrs. Resolución'],
    ...filtered.map((i, idx) => [
      idx + 1,
      new Date(i.date).toLocaleDateString('es-PE'),
      i.section || i.sector || '—',
      i.incident_type || '—',
      i.description || '—',
      i.resolved ? 'Resuelto' : 'Pendiente',
      i.resolution_time_hours ?? '—'
    ])
  ];
  const wsInc = XLSX.utils.aoa_to_sheet(incRows);
  wsInc['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 45 }, { wch: 14 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsInc, 'Registro Incidentes');

  if (annualOHSPlan) {
    const planRows = [
      ['Cumplimiento Global (%)', annualOHSPlan.global_compliance],
      ['Meta (%)', annualOHSPlan.goal],
      ['Actividades completadas', annualOHSPlan.completed_activities],
      ['Actividades planificadas', annualOHSPlan.total_activities],
      ['Meses críticos', annualOHSPlan.critical_months],
      [],
      ['Sector', 'Cumplimiento (%)', 'Completadas', 'Planificadas', 'Resultado'],
      ...(annualOHSPlan.details_by_sector || []).map(s => [
        s.sector, s.compliance, s.completed_activities, s.planned_activities,
        s.compliance >= 80 ? 'Cumple' : 'No cumple'
      ])
    ];
    const wsPlan = XLSX.utils.aoa_to_sheet(planRows);
    wsPlan['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsPlan, 'Cumplimiento SST');
  }

  const from2 = fromStr.replace(/\//g, '-');
  const to2   = toStr.replace(/\//g, '-');
  const fileName = `RiskGuard_Auditoria_${from2}_${to2}.xlsx`;
  saveWorkbook(wb, fileName);
  return fileName;
}

export function generateComplianceExcel({ sectorFilter, annualOHSPlan, kpiDashboard, incidents }) {
  const wb = XLSX.utils.book_new();
  const sectorLabel = sectorFilter || 'Todos los sectores';

  addHeaderSheet(wb, 'Reporte de Cumplimiento Normativo', [
    ['Sector', sectorLabel],
    ['Generado', new Date().toLocaleDateString('es-PE')],
    ['Ley aplicable', 'N° 29783']
  ]);

  // KPI compliance
  const kpiMap = {};
  kpiDashboard.forEach(k => { kpiMap[k.name] = k; });

  const kpiRows = [
    ['Indicador', 'Valor', 'Meta'],
    ['Cumplimiento Plan SST (%)', kpiMap.ohs_plan_compliance?.value ?? '—', kpiMap.ohs_plan_compliance?.goal ?? 80]
  ];
  const wsKPI = XLSX.utils.aoa_to_sheet(kpiRows);
  wsKPI['!cols'] = [{ wch: 28 }, { wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsKPI, 'KPI Cumplimiento');

  // Sector detail
  if (annualOHSPlan) {
    const sectors = sectorFilter
      ? (annualOHSPlan.details_by_sector || []).filter(s => s.sector === sectorFilter)
      : (annualOHSPlan.details_by_sector || []);

    const sectorRows = [
      ['Sector', 'Cumplimiento (%)', 'Completadas', 'Planificadas', 'Estado'],
      ...sectors.map(s => [
        s.sector, s.compliance, s.completed_activities, s.planned_activities,
        s.compliance >= 80 ? 'Óptimo' : s.compliance >= 50 ? 'Aceptable' : 'Crítico'
      ])
    ];
    const wsSec = XLSX.utils.aoa_to_sheet(sectorRows);
    wsSec['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsSec, 'Detalle Sectores');
  }

  // Incidents
  const filteredInc = sectorFilter
    ? incidents.filter(i => (i.section || i.sector) === sectorFilter)
    : incidents;

  const incRows = [
    ['Fecha', 'Sector', 'Tipo', 'Estado', 'Hrs. Resolución'],
    ...filteredInc.map(i => [
      new Date(i.date).toLocaleDateString('es-PE'),
      i.section || i.sector || '—',
      i.incident_type || '—',
      i.resolved ? 'Resuelto' : 'Pendiente',
      i.resolution_time_hours ?? '—'
    ])
  ];
  const wsInc = XLSX.utils.aoa_to_sheet(incRows);
  wsInc['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 22 }, { wch: 12 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsInc, 'Incidentes');

  const sectorPart = sectorFilter || 'todos';
  const fileName = `RiskGuard_Cumplimiento_${sectorPart}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveWorkbook(wb, fileName);
  return fileName;
}
