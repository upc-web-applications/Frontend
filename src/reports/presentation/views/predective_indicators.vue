<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted, computed } from 'vue';

const { t } = useI18n();
const store = useReportsStore();

onMounted(async () => {
  await store.fetchPredictiveIndicators();
});

const latest = computed(() => store.predictiveIndicators[0] || null);

const getTrendIcon = (variation) => {
  if (variation > 0) return 'pi pi-arrow-up';
  if (variation < 0) return 'pi pi-arrow-down';
  return 'pi pi-minus';
};

const getTrendColor = (variation) => {
  if (variation > 0) return '#EF4444';
  if (variation < 0) return '#10B981';
  return '#FBBF24';
};

const getTrendLabel = (trend) => {
  if (trend === 'increasing') return t('predictive_indicators.tendency_increasing');
  if (trend === 'decreasing') return t('predictive_indicators.decreasing');
  return t('predictive_indicators.stable');
};

const getTrendSeverity = (trend) => {
  if (trend === 'increasing') return 'warning';
  if (trend === 'decreasing') return 'success';
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
    </div>

    <!-- LOADING -->
    <div v-if="store.isLoading" class="loading-state">
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

        <div class="sectors-grid">
          <div
              v-for="sector in latest.sectors_with_increasing_trend"
              :key="sector.sector"
              class="sector-card"
          >
            <div class="sector-top">
              <span class="sector-name">{{ sector.sector }}</span>
              <pv-tag
                  :value="sector.status === 'critical' ? t('predictive_indicators.critical') : t('predictive_indicators.alert')"
                  :severity="sector.status === 'critical' ? 'danger' : 'warning'"
              />
            </div>
            <div class="sector-stats">
              <div class="stat-box">
                <span class="stat-label">{{ t('predictive_indicators.events') }}</span>
                <span class="stat-value">{{ sector.events }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">{{ t('predictive_indicators.trend_percentage') }}</span>
                <span class="stat-value" style="color: #EF4444;">+{{ sector.variation_percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECURRING INCIDENT TYPES -->
      <div class="section-card" v-if="latest.recurring_incident_types?.length > 0">
        <h2 class="section-title">{{ t('predictive_indicators.recurring_types') }}</h2>

        <div class="types-grid">
          <div
              v-for="item in latest.recurring_incident_types"
              :key="item.type"
              class="type-card"
          >
            <div class="type-top">
              <span class="type-name">{{ item.type }}</span>
              <span class="cases-badge">{{ item.count }} {{ t('predictive_indicators.cases') }}</span>
            </div>
            <div class="type-bottom">
              <pv-tag
                  :value="getTrendLabel(item.trend)"
                  :severity="getTrendSeverity(item.trend)"
              />
              <span class="type-pct">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
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

/* SECTORS */
.sectors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.sector-card {
  background: rgba(255, 91, 0, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
}

.sector-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.sector-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
}

.sector-stats {
  display: flex;
  gap: 12px;
}

.stat-box {
  flex: 1;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  padding: 8px;
}

.stat-label {
  display: block;
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
}

/* TYPES */
.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.type-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px;
}

.type-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.type-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
}

.cases-badge {
  background: rgba(255, 91, 0, 0.2);
  color: var(--primary-color);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.type-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-pct {
  font-size: 13px;
  color: var(--text-secondary);
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
  .kpis-grid,
  .sectors-grid,
  .types-grid { grid-template-columns: 1fr; }
  .history-header,
  .history-row { grid-template-columns: 1fr 1fr 1fr; }
  .history-header span:nth-child(4),
  .history-header span:nth-child(5),
  .history-row span:nth-child(4),
  .history-row span:nth-child(5) { display: none; }
}
</style>
