<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { t, locale } = useI18n();
const store = useReportsStore();
const toast = useToast();

onMounted(async () => {
  await store.fetchAnnualOHSPlan();
});

const exportSSTpdf = () => {
  const plan = store.annualOHSPlan;
  if (!plan) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const BRAND = '#FF5B00';

  // Header
  doc.setFillColor('#0F1115');
  doc.rect(0, 0, 210, 28, 'F');
  doc.setFontSize(18); doc.setTextColor(BRAND); doc.setFont('helvetica', 'bold');
  doc.text('RiskGuard', 14, 12);
  doc.setFontSize(10); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'normal');
  doc.text('Informe Anual — Plan de SST', 14, 20);
  doc.setFontSize(8); doc.setTextColor('#6B7280');
  doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 196, 26, { align: 'right' });

  let y = 38;

  // Global KPIs
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(BRAND);
  doc.text('Resumen Global', 14, y);
  doc.setDrawColor(BRAND); doc.setLineWidth(0.5); doc.line(14, y + 2, 196, y + 2);
  y += 12;

  const rows = [
    ['Cumplimiento global', `${plan.global_compliance}%`],
    ['Meta establecida', `${plan.goal}%`],
    ['Actividades completadas', `${plan.completed_activities} / ${plan.total_activities}`],
    ['Meses críticos', plan.critical_months],
    ['Estado', plan.global_compliance >= 80 ? 'Óptimo' : plan.global_compliance >= 50 ? 'Aceptable' : 'Crítico']
  ];
  rows.forEach(([label, val]) => {
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(50, 50, 50);
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text(String(val), 120, y);
    y += 8;
  });
  y += 6;

  // Monthly table
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(BRAND);
  doc.text('Detalle Mensual', 14, y);
  doc.setDrawColor(BRAND); doc.line(14, y + 2, 196, y + 2);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [['Mes', 'Cumplimiento', 'Completadas', 'Planificadas', 'Estado']],
    body: (plan.monthly_details || []).map(m => [
      new Date(plan.year || 2024, m.month - 1).toLocaleString(locale.value, { month: 'long' }),
      `${m.compliance}%`, m.completed_activities, m.planned_activities,
      m.status === 'optimal' ? 'Óptimo' : m.status === 'acceptable' ? 'Aceptable' : 'Crítico'
    ]),
    headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 }, theme: 'striped'
  });
  y = doc.lastAutoTable.finalY + 10;

  // By sector
  if (plan.details_by_sector?.length) {
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(BRAND);
    doc.text('Cumplimiento por Sector', 14, y);
    doc.setDrawColor(BRAND); doc.line(14, y + 2, 196, y + 2);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [['Sector', 'Cumplimiento', 'Completadas', 'Planificadas', 'Resultado']],
      body: plan.details_by_sector.map(s => [
        s.sector, `${s.compliance}%`, s.completed_activities, s.planned_activities,
        s.compliance >= 80 ? 'Cumple' : 'No cumple'
      ]),
      headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 }, theme: 'striped'
    });
  }

  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(7); doc.setTextColor('#6B7280');
    doc.text(`Página ${p} de ${pages} — RiskGuard`, 105, 290, { align: 'center' });
  }

  doc.save(`RiskGuard_Plan_SST_${plan.year || new Date().getFullYear()}.pdf`);
  toast.add({ severity: 'success', summary: t('common.success'), detail: t('success.report_generated'), life: 3000 });
};

const getStatusColor = (percentage) => {
  if (percentage >= 80) return '#22C55E';
  if (percentage >= 50) return '#FBBF24';
  return '#EF4444';
};

const getStatusLabel = (percentage) => {
  if (percentage >= 80) return t('plan_sst.optimal');
  if (percentage >= 50) return t('plan_sst.acceptable');
  return t('plan_sst.critical');
};

const getStatusSeverity = (percentage) => {
  if (percentage >= 80) return 'success';
  if (percentage >= 50) return 'warning';
  return 'danger';
};

const chartData = computed(() => ({
  labels: store.annualOHSPlan?.monthly_details?.map(d =>
      new Date(2024, d.month - 1).toLocaleString(locale.value, { month: 'short' })
  ) || [],
  datasets: [
    {
      label: t('plan_sst.compliance_percentage'),
      data: store.annualOHSPlan?.monthly_details?.map(d => d.compliance) || [],
      borderColor: '#FF5B00',
      backgroundColor: 'rgba(255, 91, 0, 0.1)',
      tension: 0.3,
      fill: true
    }
  ]
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      labels: { color: '#fff' }
    }
  },
  scales: {
    y: {
      ticks: { color: '#fff' },
      grid: { color: '#1a1e24' },
      min: 0,
      max: 100
    },
    x: {
      ticks: { color: '#fff' },
      grid: { color: '#1a1e24' }
    }
  }
};
</script>

<template>
  <div class="sst-plan-container">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('plan_sst.title') }}</h1>
      </div>
      <pv-button
          icon="pi pi-download"
          :label="t('plan_sst.report_pdf')"
          severity="warning"
          @click="exportSSTpdf"
      />
    </div>

    <!-- LOADING -->
    <div v-if="store.loadingAnnualOHSPlan" class="loading-state">
      <pv-spinner />
    </div>

    <!-- CONTENT -->
    <div v-else-if="store.annualOHSPlan" class="content">

      <!-- Global Compliance Cards -->
      <div class="section-card">
        <h2 class="section-title">{{ t('plan_sst.global_compliance') }}</h2>

        <div class="compliance-cards">

          <div class="compliance-card">
            <div
                class="compliance-value"
                :style="{ color: getStatusColor(store.annualOHSPlan.global_compliance) }"
            >
              {{ store.annualOHSPlan.global_compliance }}%
            </div>
            <div class="compliance-label">{{ t('plan_sst.global_compliance') }}</div>
            <pv-progress-bar
                :value="store.annualOHSPlan.global_compliance"
                :show-value="false"
                style="height: 8px;"
            />
            <div class="compliance-status">
              {{ getStatusLabel(store.annualOHSPlan.global_compliance) }}
            </div>
          </div>

          <div class="compliance-card">
            <div class="compliance-value">
              {{ store.annualOHSPlan.completed_activities }}
            </div>
            <div class="compliance-label">{{ t('plan_sst.activities_completed') }}</div>
            <div class="total-activities">
              {{ t('plan_sst.of') }} {{ store.annualOHSPlan.total_activities }}
            </div>
          </div>

          <div class="compliance-card">
            <div class="compliance-value" style="color: #FF5B00;">
              {{ store.annualOHSPlan.goal }}%
            </div>
            <div class="compliance-label">{{ t('dashboard.goal') }}</div>
          </div>

        </div>
      </div>

      <!-- Critical Alert -->
      <div v-if="store.annualOHSPlan.global_compliance < 50" class="alert-box">
        <i class="pi pi-exclamation-triangle alert-icon"></i>
        <div>
          <strong>{{ t('plan_sst.critical_alert') }}</strong>
          <p>{{ t('plan_sst.alert_text') }}</p>
        </div>
      </div>

      <!-- Monthly Compliance Chart -->
      <div class="section-card">
        <h2 class="section-title">{{ t('plan_sst.monthly_compliance') }}</h2>
        <pv-chart type="line" :data="chartData" :options="chartOptions" />
      </div>

      <!-- By Sector -->
      <div class="section-card">
        <h2 class="section-title">{{ t('plan_sst.by_category') }}</h2>

        <div class="categories-grid">
          <div
              v-for="sector in store.annualOHSPlan.details_by_sector"
              :key="sector.sector"
              class="category-card"
          >
            <div class="category-header">
              <h3>{{ sector.sector }}</h3>
              <span
                  class="percentage"
                  :style="{ color: getStatusColor(sector.compliance) }"
              >
                {{ sector.compliance }}%
              </span>
            </div>

            <pv-progress-bar
                :value="sector.compliance"
                :show-value="false"
                style="height: 6px; margin: 8px 0;"
            />

            <div class="category-footer">
              <span class="activities">
                {{ sector.completed_activities }}/{{ sector.planned_activities }}
              </span>
              <pv-tag
                  :value="getStatusLabel(sector.compliance)"
                  :severity="getStatusSeverity(sector.compliance)"
              />
            </div>

          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color" style="background-color: #22C55E;"></div>
          <span>{{ t('plan_sst.green_optimal') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #FBBF24;"></div>
          <span>{{ t('plan_sst.yellow_attention') }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: #EF4444;"></div>
          <span>{{ t('plan_sst.red_critical') }}</span>
        </div>
      </div>

    </div>

    <!-- EMPTY STATE -->
    <div v-else class="empty-state">
      <i class="pi pi-shield empty-icon"></i>
      <p>{{ t('errors.no_data') }}</p>
    </div>

  </div>
</template>

<style scoped>
.sst-plan-container {
  padding: 30px;
  background-color: var(--dark-bg);
  color: var(--text-color);
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 20px;
}

.section-card {
  background: linear-gradient(135deg, #1a1e24 0%, #0f1115 100%);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
}

.compliance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.compliance-card {
  background: rgba(255, 91, 0, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px 16px;
  text-align: center;
}

.compliance-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 6px;
}

.compliance-label {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.compliance-status {
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.total-activities {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.alert-box {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #EF4444;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
  color: #EF4444;
}

.alert-box p {
  margin: 4px 0 0;
  color: var(--text-color);
  font-size: 14px;
}

.alert-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.category-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-header h3 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.percentage {
  font-size: 20px;
  font-weight: 700;
}

.category-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.activities {
  font-size: 12px;
  color: var(--text-secondary);
}

.legend {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 16px 24px;
  background: linear-gradient(135deg, #1a1e24 0%, #0f1115 100%);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text-secondary);
  gap: 16px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

@media (max-width: 768px) {
  .sst-plan-container { padding: 15px; }
  .page-header { flex-direction: column; gap: 16px; }
  .page-title { font-size: 22px; }
  .compliance-cards { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: 1fr; }
  .legend { gap: 16px; }
}
</style>
