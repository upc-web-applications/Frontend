<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { generateExecutiveSummaryPDF, downloadPDF } from '@/reports/infrastructure/pdf-report.service.js';

const { t } = useI18n();
const store = useReportsStore();
const toast = useToast();

onMounted(async () => {
  await Promise.all([
    store.fetchOperationalData(),
    store.fetchPredictiveIndicators(),
    store.fetchKPIDashboard()
  ]);
});

const exportExecutiveSummary = () => {
  if (!store.predictiveIndicators.length) {
    toast.add({ severity: 'warn', summary: t('common.warning'), detail: t('errors.no_data'), life: 3000 });
    return;
  }
  const doc = generateExecutiveSummaryPDF({
    predictiveIndicators: store.predictiveIndicators,
    kpiDashboard:         store.kpiDashboard,
    date:                 new Date().toISOString()
  });
  const fileName = `RiskGuard_Resumen_Ejecutivo_${new Date().toISOString().slice(0, 10)}.pdf`;
  downloadPDF(doc, fileName);
  toast.add({ severity: 'success', summary: t('common.success'), detail: t('success.report_generated'), life: 3000 });
};

const latest = computed(() => store.predictiveIndicators[0] || null);

const getTrendIcon = (variation) => {
  if (variation > 0) return 'pi pi-arrow-up';
  if (variation < 0) return 'pi pi-arrow-down';
  return 'pi pi-minus';
};

const getTrendColor = (variation) => {
  if (variation > 0) return '#EF4444';
  if (variation < 0) return '#22C55E';
  return '#FBBF24';
};

const getTrendLabel = (trend) => {
  if (trend === 'increasing') return t('predictive_indicators.tendency_increasing');
  if (trend === 'decreasing') return t('predictive_indicators.decreasing');
  return t('predictive_indicators.stable');
};

const getTrendSeverity = (trend) => {
  if (trend === 'increasing') return 'success';
  if (trend === 'decreasing') return 'danger';
  return 'info';
};
</script>

<template>
  <div class="indicators-container">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('predictive_indicators.title') }}</h1>
        <p class="page-subtitle">{{ t('predictive_indicators.subtitle') }}</p>
      </div>
      <pv-button
          icon="pi pi-file-pdf"
          :label="t('predictive_indicators.export_summary')"
          severity="warning"
          @click="exportExecutiveSummary"
      />
    </div>

    <!-- LOADING -->
    <div v-if="store.loadingPredictiveIndicators" class="loading-state">
      <pv-spinner />
    </div>

    <!-- EMPTY -->
    <div v-else-if="!latest" class="empty-state">
      <i class="pi pi-chart-line empty-icon"></i>
      <p>{{ t('errors.no_data') }}</p>
    </div>

    <!-- CONTENT -->
    <div v-else class="content">

      <!-- KPI CARDS -->
      <div class="kpis-grid">

        <div class="kpi-card">
          <div class="kpi-icon-box">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="kpi-body">
            <p class="kpi-label">{{ t('predictive_indicators.total_incidents') }}</p>
            <p class="kpi-value">{{ latest.total_incidents }}</p>
            <p class="kpi-trend" :style="{ color: getTrendColor(latest.previous_month_variation) }">
              <i :class="getTrendIcon(latest.previous_month_variation)" />
              {{ latest.previous_month_variation > 0 ? '+' : '' }}{{ latest.previous_month_variation }}%
              <span class="vs-label">{{ t('predictive_indicators.vs_previous_month') }}</span>
            </p>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box">
            <i class="pi pi-clock"></i>
          </div>
          <div class="kpi-body">
            <p class="kpi-label">{{ t('predictive_indicators.time_resolution') }}</p>
            <p class="kpi-value">{{ latest.average_resolution_time_hours }}<span class="kpi-unit">h</span></p>
            <p class="kpi-meta">{{ t('predictive_indicators.meta') }}: {{ latest.resolution_goal_hours }}h</p>
          </div>
        </div>

        <div class="kpi-card kpi-alert">
          <div class="kpi-icon-box alert">
            <i class="pi pi-bell"></i>
          </div>
          <div class="kpi-body">
            <p class="kpi-label">{{ t('predictive_indicators.sectors_alert') }}</p>
            <p class="kpi-value">{{ latest.sectors_with_increasing_trend?.length || 0 }}</p>
            <p class="kpi-meta">{{ t('predictive_indicators.tendency_increasing') }}</p>
          </div>
        </div>

      </div>

      <!-- TRENDING SECTORS -->
      <div class="section-card" v-if="latest.sectors_with_increasing_trend?.length > 0">
        <h2 class="section-title">{{ t('predictive_indicators.sectors_trending') }}</h2>
        <pv-data-table :value="latest.sectors_with_increasing_trend" size="small">
          <pv-column field="sector" :header="t('predictive_indicators.sector')" />
          <pv-column field="events" :header="t('predictive_indicators.events')" style="width:12%" />
          <pv-column :header="t('predictive_indicators.trend_percentage')" style="width:14%">
            <template #body="{ data }">
              <span style="color:#EF4444; font-weight:700;">+{{ data.variation_percentage }}%</span>
            </template>
          </pv-column>
          <pv-column :header="t('common.status')" style="width:14%">
            <template #body="{ data }">
              <pv-tag
                  :value="data.status === 'critical' ? t('predictive_indicators.critical') : t('predictive_indicators.alert')"
                  :severity="data.status === 'critical' ? 'danger' : 'warning'"
              />
            </template>
          </pv-column>
        </pv-data-table>
      </div>

      <!-- RECURRING INCIDENT TYPES -->
      <div class="section-card" v-if="latest.recurring_incident_types?.length > 0">
        <h2 class="section-title">{{ t('predictive_indicators.recurring_types') }}</h2>
        <pv-data-table :value="latest.recurring_incident_types" size="small">
          <pv-column field="type" :header="t('my_reports.type')" />
          <pv-column field="count" :header="t('predictive_indicators.cases')" style="width:12%" />
          <pv-column :header="'% total'" style="width:12%">
            <template #body="{ data }">
              <div class="pct-bar">
                <div class="pct-bar__fill" :style="{ width: data.percentage + '%' }"></div>
                <span>{{ data.percentage }}%</span>
              </div>
            </template>
          </pv-column>
          <pv-column :header="'Tendencia'" style="width:18%">
            <template #body="{ data }">
              <pv-tag
                  :value="getTrendLabel(data.trend)"
                  :severity="getTrendSeverity(data.trend)"
              />
            </template>
          </pv-column>
        </pv-data-table>
      </div>

      <!-- HISTORY: all periods comparison -->
      <div class="section-card" v-if="store.predictiveIndicators.length > 1">
        <h2 class="section-title">{{ t('predictive_indicators.subtitle') }}</h2>

        <div class="history-table">
          <div class="history-header">
            <span>ID</span>
            <span>{{ t('predictive_indicators.total_incidents') }}</span>
            <span>{{ t('predictive_indicators.vs_previous_month') }}</span>
            <span>{{ t('predictive_indicators.time_resolution') }}</span>
            <span>{{ t('predictive_indicators.sectors_alert') }}</span>
          </div>
          <div
              v-for="ind in store.predictiveIndicators"
              :key="ind.id"
              class="history-row"
          >
            <span class="history-id">{{ ind.id }}</span>
            <span class="history-value">{{ ind.total_incidents }}</span>
            <span
                class="history-trend"
                :style="{ color: getTrendColor(ind.previous_month_variation) }"
            >
              <i :class="getTrendIcon(ind.previous_month_variation)" />
              {{ ind.previous_month_variation > 0 ? '+' : '' }}{{ ind.previous_month_variation }}%
            </span>
            <span class="history-value">{{ ind.average_resolution_time_hours }}h</span>
            <span class="history-value">{{ ind.sectors_with_increasing_trend?.length || 0 }}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.indicators-container {
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
  margin: 0 0 6px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* KPI CARDS */
.kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.kpi-card {
  background: linear-gradient(135deg, #1a1e24 0%, #0f1115 100%);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.kpi-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: rgba(255, 91, 0, 0.15);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.kpi-icon-box.alert {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
}

.kpi-body {
  flex: 1;
}

.kpi-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 6px;
}

.kpi-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 6px;
  line-height: 1;
}

.kpi-unit {
  font-size: 18px;
  font-weight: 400;
  color: var(--text-secondary);
}

.kpi-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.vs-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.kpi-meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

/* SECTIONS */
.section-card {
  background: linear-gradient(135deg, #1a1e24 0%, #0f1115 100%);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 20px;
}

/* TABLE DARK THEME */
:deep(.p-datatable-thead > tr > th) {
  background: #0f1115;
  color: var(--primary-color);
  border-color: var(--border-color, #2a2f38);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.p-datatable-tbody > tr) {
  background: #0e1c2f;
  color: var(--text-color);
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: #091422;
}

:deep(.p-datatable-tbody > tr:hover > td) {
  background: rgba(255, 91, 0, 0.05) !important;
}

:deep(.p-datatable-tbody > tr > td) {
  border-color: rgba(59, 130, 246, 0.1);
  font-size: 13px;
}

/* PCT BAR */
.pct-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pct-bar__fill {
  height: 6px;
  background: var(--primary-color);
  border-radius: 3px;
  max-width: 80px;
  min-width: 4px;
}

.pct-bar span {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* HISTORY TABLE */
.history-table {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.history-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  background: rgba(255, 91, 0, 0.1);
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  gap: 8px;
}

.history-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  padding: 12px 16px;
  font-size: 13px;
  border-top: 1px solid var(--border-color);
  gap: 8px;
  align-items: center;
}

.history-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.history-id {
  color: var(--text-secondary);
  font-size: 12px;
}

.history-value {
  color: var(--text-color);
  font-weight: 600;
}

.history-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 13px;
}

/* STATES */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .indicators-container { padding: 15px; }
  .page-title { font-size: 22px; }
  .kpis-grid { grid-template-columns: 1fr; }
  .history-header,
  .history-row { grid-template-columns: 1fr 1fr 1fr; }
  .history-header span:nth-child(4),
  .history-header span:nth-child(5),
  .history-row span:nth-child(4),
  .history-row span:nth-child(5) { display: none; }
}
</style>
