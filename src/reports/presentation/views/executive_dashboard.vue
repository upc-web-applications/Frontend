<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted, computed } from 'vue';

const { t } = useI18n();
const store = useReportsStore();

// KPI colors
const kpiColors = computed(() => {
  const colors = {};

  store.kpiDashboard.forEach((kpi) => {
    if (kpi.status === 'optimal') {
      colors[kpi.id] = '#10B981';
    } else if (kpi.status === 'alert') {
      colors[kpi.id] = '#FBBF24';
    } else {
      colors[kpi.id] = '#EF4444';
    }
  });

  return colors;
});

// Trend chart data
const trendChartData = computed(() => ({
  labels: store.historicalTrends.map(
      trend => `${trend.month}/${trend.year}`
  ),

  datasets: [
    {
      label: 'Incidents',
      data: store.historicalTrends.map(
          trend => trend.total_incidents
      ),
      borderColor: '#FF5B00',
      backgroundColor: 'rgba(255,91,0,0.2)',
      fill: true,
      tension: 0.4
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      labels: {
        color: '#FFFFFF'
      }
    }
  },

  scales: {
    x: {
      ticks: {
        color: '#9CA3AF'
      },
      grid: {
        color: '#1A1E24'
      }
    },

    y: {
      ticks: {
        color: '#9CA3AF'
      },
      grid: {
        color: '#1A1E24'
      }
    }
  }
};

onMounted(async () => {
  await Promise.all([
    store.fetchKPIDashboard(),
    store.fetchHistoricalTrends(),
    store.fetchCriticalAlerts(),
    store.fetchIncidents(),
    store.fetchAnnualOHSPlan(),
    store.fetchPredictiveIndicators()
  ]);
});

const exportDashboard = () => {
  console.log('Exporting dashboard...');
};
</script>

<template>
  <div class="dashboard-container">

    <!-- HEADER -->
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">
          {{ t('dashboard.title') }}
        </h1>

        <p class="dashboard-subtitle">
          {{ t('dashboard.monitor') }}
        </p>
      </div>

      <pv-button
          label="Export"
          icon="pi pi-download"
          class="export-btn"
          severity="warning"
          @click="exportDashboard"
      />
    </div>

    <!-- KPI SECTION -->
    <div class="section">
      <div class="section-header">
        <h2>{{ t('dashboard.kpi_security') }}</h2>
      </div>

      <div class="kpi-grid">
        <div
            v-for="kpi in store.kpiDashboard"
            :key="kpi.id"
            class="kpi-card"
            :style="{ borderLeft: `5px solid ${kpiColors[kpi.id]}` }"
        >
          <div class="kpi-header">
            <span class="kpi-name">
              {{ t(`kpi.${kpi.name}`) || kpi.name }}
            </span>

            <pv-tag
                :value="t(`kpi.status_${kpi.status}`) || kpi.status"
                :severity="
                kpi.status === 'optimal'
                  ? 'success'
                  : kpi.status === 'alert'
                  ? 'warning'
                  : 'danger'
              "
            />
          </div>

          <div class="kpi-value">
            {{ kpi.value }}{{ kpi.name === 'ohs_plan_compliance' ? '%' : '' }}
          </div>

          <div class="kpi-footer">
            <span>
              {{ t('dashboard.goal') }}: {{ kpi.goal }}{{ kpi.name === 'ohs_plan_compliance' ? '%' : '' }}
            </span>

            <span class="status-text">
              {{ t(`kpi.status_${kpi.status}`) || kpi.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- CHART -->
    <div class="section chart-section">
      <div class="section-header">
        <h2>{{ t('dashboard.trends') }}</h2>
      </div>

      <div class="chart-wrapper">
        <pv-chart
            type="line"
            :data="trendChartData"
            :options="chartOptions"
        />
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid">

      <!-- ACTIVE INCIDENTS -->
      <div class="stat-card">
        <div class="stat-icon critical">
          <i class="pi pi-exclamation-circle"></i>
        </div>

        <div class="stat-info">
          <span class="stat-label">
            {{ t('dashboard.active_incidents') }}
          </span>

          <span class="stat-value">
            {{ store.activeIncidents.length }}
          </span>
        </div>
      </div>

      <!-- RESOLVED -->
      <div class="stat-card">
        <div class="stat-icon success">
          <i class="pi pi-check-circle"></i>
        </div>

        <div class="stat-info">
          <span class="stat-label">
            {{ t('dashboard.resolved_month') }}
          </span>

          <span class="stat-value">
            {{ store.resolvedIncidents.length }}
          </span>
        </div>
      </div>

      <!-- ALERTS -->
      <div class="stat-card">
        <div class="stat-icon warning">
          <i class="pi pi-bell"></i>
        </div>

        <div class="stat-info">
          <span class="stat-label">
            {{ t('notifications.critical') }}
          </span>

          <span class="stat-value">
            {{ store.unresolvedCriticalAlerts.length }}
          </span>
        </div>
      </div>

      <!-- OHS -->
      <div class="stat-card">
        <div class="stat-icon info">
          <i class="pi pi-chart-bar"></i>
        </div>

        <div class="stat-info">
          <span class="stat-label">
            {{ t('dashboard.sst_compliance') }}
          </span>

          <span class="stat-value">
            {{
              store.annualOHSPlan?.global_compliance || 0
            }}%
          </span>
        </div>
      </div>
    </div>

    <!-- PREDICTIVE INDICATORS -->
    <div class="section">
      <div class="section-header">
        <h2>{{ t('predictive_indicators.title') }}</h2>
      </div>

      <div
          v-if="store.predictiveIndicators.length === 0"
          class="empty-state"
      >
        {{ t('errors.no_data') }}
      </div>

      <div v-else class="predictive-grid">
        <div
            v-for="indicator in store.predictiveIndicators"
            :key="indicator.id"
            class="predictive-card"
        >
          <div class="predictive-title">
            {{ indicator.period_days }} Days
          </div>

          <div class="predictive-metric">
            <span>{{ t('predictive_indicators.total_incidents') }}</span>
            <strong>{{ indicator.total_incidents }}</strong>
          </div>

          <div class="predictive-metric">
            <span>{{ t('predictive_indicators.vs_previous_month') }}</span>
            <strong>{{ indicator.previous_month_variation }}%</strong>
          </div>

          <div class="predictive-metric">
            <span>{{ t('predictive_indicators.time_resolution') }}</span>
            <strong>{{ indicator.average_resolution_time_hours }} hrs</strong>
          </div>

          <div
              class="tags"
              v-if="indicator.sectors_with_increasing_trend?.length"
          >
            <pv-tag
                v-for="sector in indicator.sectors_with_increasing_trend"
                :key="sector.sector"
                :value="sector.sector"
                :severity="sector.status === 'critical' ? 'danger' : 'warning'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div
        v-if="store.isLoading"
        class="loading-container"
    >
      <pv-spinner />
    </div>

  </div>
</template>

<style scoped>
.dashboard-container {
  background: var(--dark-bg);
  min-height: 100%;
  padding: 30px;
  color: var(--text-color);
}

/* HEADER */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.dashboard-title {
  margin: 0;
  font-size: 20px;
  color: var(--rg-text);
  font-weight: 700;
  font-family: 'Syne', sans-serif;
}

.dashboard-subtitle {
  color: var(--rg-text-muted);
  margin-top: 4px;
  font-size: 13px;
}

.export-btn {
  height: 45px;
}

/* SECTION */

.section {
  margin-bottom: 40px;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 20px;
  font-weight: 600;
}

/* KPI */

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.kpi-card {
  background: linear-gradient(
      135deg,
      #1A1E24 0%,
      #0F1115 100%
  );

  border-radius: 10px;
  padding: 20px;
  transition: 0.3s;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-name {
  color: var(--text-secondary);
  font-size: 13px;
  text-transform: uppercase;
}

.kpi-value {
  margin: 10px 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--rg-text);
  font-family: 'DM Sans', sans-serif;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 12px;
}

.status-text {
  text-transform: capitalize;
}

/* CHART */

.chart-section {
  background: linear-gradient(
      135deg,
      #1A1E24 0%,
      #0F1115 100%
  );

  padding: 25px;
  border-radius: 10px;
}

.chart-wrapper {
  height: 400px;
}

/* STATS */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(
      auto-fit,
      minmax(220px, 1fr)
  );

  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(
      135deg,
      #1A1E24 0%,
      #0F1115 100%
  );
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  flex-shrink: 0;
}

.stat-icon.critical {
  background: rgba(239,68,68,0.2);
  color: #EF4444;
}

.stat-icon.success {
  background: rgba(16,185,129,0.2);
  color: #10B981;
}

.stat-icon.warning {
  background: rgba(251,191,36,0.2);
  color: #FBBF24;
}

.stat-icon.info {
  background: rgba(59,130,246,0.2);
  color: #3B82F6;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 13px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
  font-family: 'DM Sans', sans-serif;
  color: var(--rg-text);
}

/* PREDICTIVE */

.predictive-grid {
  display: grid;
  grid-template-columns: repeat(
      auto-fit,
      minmax(300px, 1fr)
  );

  gap: 20px;
}

.predictive-card {
  background: linear-gradient(
      135deg,
      #1A1E24 0%,
      #0F1115 100%
  );

  border-radius: 10px;
  padding: 20px;
  border-left: 5px solid var(--primary-color);
}

.predictive-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 16px;
  font-family: 'DM Sans', sans-serif;
}

.predictive-metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.predictive-metric span {
  color: var(--text-secondary);
}

.predictive-metric strong {
  color: white;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

/* EMPTY */

.empty-state {
  background: #111418;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
}

/* LOADING */

.loading-container {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

/* RESPONSIVE */

@media (max-width: 768px) {

  .dashboard-container {
    padding: 20px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .dashboard-title {
    font-size: 26px;
  }

  .chart-wrapper {
    height: 300px;
  }
}
</style>