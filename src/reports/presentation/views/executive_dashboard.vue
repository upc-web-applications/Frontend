<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted, computed, ref } from 'vue';
import RgChart from '@/shared/presentation/components/rg-chart.vue';
import { generateExecutiveSummaryPDF, downloadPDF, pdfToBlob } from '@/reports/infrastructure/pdf-report.service.js';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const store = useReportsStore();
const toast = useToast();

const showPreview        = ref(false);
const previewUrl         = ref(null);
const selectedSector     = ref(null);
const chartRef           = ref(null);
const showByType         = ref(false);
const showSectorDetail   = ref(false);
const sectorDetailData   = ref({ title: '', sectors: [], incidents: [] });

const sectorOptions = computed(() => {
  const all = { label: t('new_report.all_sectors'), value: null };
  const sectors = new Set();
  store.historicalTrends.forEach(tr => {
    Object.keys(tr.incidents_by_sector || {}).forEach(s => sectors.add(s));
  });
  return [all, ...[...sectors].map(s => ({ label: s, value: s }))];
});

// KPI colors
const kpiColors = computed(() => {
  const colors = {};

  store.kpiDashboard.forEach((kpi) => {
    if (kpi.status === 'optimal') {
      colors[kpi.id] = '#22C55E';
    } else if (kpi.status === 'alert') {
      colors[kpi.id] = '#FBBF24';
    } else {
      colors[kpi.id] = '#EF4444';
    }
  });

  return colors;
});

const trendChartData = computed(() => {
  const validTrends = store.historicalTrends.filter(tr => 
    tr && typeof tr.month === 'number' && typeof tr.year === 'number' && typeof tr.total_incidents === 'number'
  );
  
  const labels = validTrends.map(tr => `${tr.month}/${tr.year}`);
  const data   = validTrends.map(tr =>
      selectedSector.value
          ? (tr.incidents_by_sector?.[selectedSector.value] ?? 0)
          : tr.total_incidents
  );

  // Highlight months with significant increase (>20% vs previous)
  const pointColors = data.map((val, i) => {
    if (i === 0) return '#FF5B00';
    const prev = data[i - 1];
    return prev > 0 && (val - prev) / prev > 0.2 ? '#EF4444' : '#FF5B00';
  });

  return {
    labels,
    datasets: [{
      label: selectedSector.value ? selectedSector.value : t('dashboard.incidents'),
      data,
      borderColor: '#FF5B00',
      backgroundColor: 'rgba(255,91,0,0.15)',
      pointBackgroundColor: [...pointColors],
      pointBorderColor: [...pointColors],
      pointRadius: 6,
      fill: true,
      tension: 0.4
    }]
  };
});

const TYPE_COLORS = ['#FF5B00', '#3B82F6', '#22C55E', '#FBBF24', '#EF4444', '#8B5CF6', '#EC4899'];

const trendByTypeData = computed(() => {
  const validTrends = store.historicalTrends.filter(tr => 
    tr && typeof tr.month === 'number' && typeof tr.year === 'number'
  );
  
  const labels = validTrends.map(tr => `${tr.month}/${tr.year}`);

  let typeMap = {};

  if (selectedSector.value) {
    // Con sector: calcula desde incidentes individuales filtrados por sector
    store.incidents
        .filter(i => (i.section || i.sector) === selectedSector.value)
        .forEach(i => {
          const d = new Date(i.date);
          const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
          if (labels.includes(key)) {
            const type = i.incident_type || 'Sin tipo';
            if (!typeMap[type]) typeMap[type] = {};
            typeMap[type][key] = (typeMap[type][key] || 0) + 1;
          }
        });
  } else {
    // Sin sector: usa incidents_by_type de historical_trends (datos reales agregados)
    validTrends.forEach(tr => {
      const key = `${tr.month}/${tr.year}`;
      Object.entries(tr.incidents_by_type || {}).forEach(([type, count]) => {
        if (!typeMap[type]) typeMap[type] = {};
        typeMap[type][key] = count;
      });
    });
  }

  const datasets = Object.entries(typeMap).map(([type, byMonth], idx) => ({
    label: type,
    data: labels.map(l => byMonth[l] || 0),
    borderColor: TYPE_COLORS[idx % TYPE_COLORS.length],
    backgroundColor: TYPE_COLORS[idx % TYPE_COLORS.length] + '22',
    pointRadius: 5,
    fill: false,
    tension: 0.4
  }));

  return { labels, datasets };
});

const obtenerDetalleSector = (kpi) => {
  const label = t(`kpi.${kpi.name}`) || kpi.name;
  const kpiVal = kpi.value != null ? ` - ${kpi.value}${kpi.name === 'ohs_plan_compliance' ? '%' : ''}` : '';

  if (kpi.name === 'critical_sectors') {
    // Sectores criticos = sectores con alertas activas (unresolved / in_review)
    const alertsBySector = store.criticalAlerts
        .filter(a => a.status === 'unresolved' || a.status === 'in_review')
        .reduce((acc, a) => {
          if (!acc[a.sector]) acc[a.sector] = { sector: a.sector, alerts: [] };
          acc[a.sector].alerts.push(a);
          return acc;
        }, {});
    const sectors = Object.values(alertsBySector).map(s => ({
      sector: s.sector,
      compliance: store.annualOHSPlan?.details_by_sector?.find(d => d.sector === s.sector)?.compliance ?? '-',
      completed_activities: store.annualOHSPlan?.details_by_sector?.find(d => d.sector === s.sector)?.completed_activities ?? '-',
      planned_activities: store.annualOHSPlan?.details_by_sector?.find(d => d.sector === s.sector)?.planned_activities ?? '-',
      alertas_activas: s.alerts.length,
      estado: s.alerts.some(a => a.type === 'CRITICAL') ? 'Critico' : 'Alerta'
    }));
    sectorDetailData.value = { title: label + kpiVal, sectors, incidents: [], mode: 'critical' };

  } else if (kpi.name === 'ohs_plan_compliance') {
    const sectors = (store.annualOHSPlan?.details_by_sector || [])
        .map(s => ({
          ...s,
          estado: s.compliance >= 80 ? 'Optimo' : s.compliance >= 50 ? 'Aceptable' : 'Critico'
        }))
        .sort((a, b) => a.compliance - b.compliance);
    sectorDetailData.value = { title: label + kpiVal, sectors, incidents: [], mode: 'compliance' };

  } else {
    const hasOperationalTickets = store.operationalTickets.length > 0;
    const filteredInc = hasOperationalTickets
        ? store.operationalTickets.filter(ticket =>
            kpi.name === 'active_incidents'
                ? !['cerrado', 'resuelto', 'resolved', 'finalizado', 'closed'].includes((ticket.status || '').toString().toLowerCase())
                : kpi.name === 'resolved_incidents'
                    ? ['cerrado', 'resuelto', 'resolved', 'finalizado', 'closed'].includes((ticket.status || '').toString().toLowerCase())
                    : true
        )
        : store.incidents.filter(i =>
            kpi.name === 'active_incidents'   ? !i.resolved :
                kpi.name === 'resolved_incidents' ?  i.resolved : true
        );
    sectorDetailData.value = { title: label + kpiVal, sectors: [], incidents: filteredInc, mode: 'incidents' };
  }
  showSectorDetail.value = true;
};

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

const plantaSegura = computed(() => {
  const kpi = store.kpiDashboard.find(k => k.name === 'active_incidents');
  return kpi != null && kpi.value === 0;
});

onMounted(async () => {
  // 1. PRIMERO: Traer TODO del backend
  await Promise.all([
    store.fetchKPIDashboard(),
    store.fetchHistoricalTrends(),
    store.fetchCriticalAlerts(),
    store.fetchIncidents(),
    store.fetchAnnualOHSPlan(),
    store.fetchPredictiveIndicators()
  ]);
  
  // 2. DESPUÉS: Enriquecer/fallback con datos operativos
  await store.fetchOperationalData();
});

const exportChartPNG = () => {
  const chart = chartRef.value?.getChart?.();
  if (!chart) return;
  const sectorPart = selectedSector.value || 'global';
  const now = new Date().toISOString().slice(0, 10);
  const url = chart.toBase64Image();
  const a = document.createElement('a');
  a.href = url;
  a.download = `RiskGuard_Tendencias_${sectorPart}_${now}.png`;
  a.click();
};

const exportDashboard = async () => {
  try {
    const doc = generateExecutiveSummaryPDF({
      predictiveIndicators: store.predictiveIndicators,
      kpiDashboard:         store.kpiDashboard,
      date:                 new Date().toISOString()
    });
    const fileName = `RiskGuard_Resumen_Ejecutivo_${new Date().toISOString().slice(0, 10)}.pdf`;

    const blob = pdfToBlob(doc);
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(blob);
    showPreview.value = true;

    downloadPDF(doc, fileName);
    toast.add({ severity: 'success', summary: t('common.success'), detail: t('success.report_generated'), life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: err.message, life: 3000 });
  }
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
            class="kpi-card kpi-card--clickable"
            :style="{ borderLeft: `5px solid ${kpiColors[kpi.id]}` }"
            @click="obtenerDetalleSector(kpi)"
            :title="t('dashboard.see_details')"
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

    <!-- BANNER: planta sin incidentes activos (US44 Escenario 2) -->
    <div v-if="plantaSegura" class="safe-banner">
      <i class="pi pi-shield"></i>
      <span>{{ t('dashboard.plant_safe') }}</span>
    </div>

    <!-- CHART -->
    <div class="section chart-section">
      <div class="chart-header">
        <h2>{{ t('dashboard.trends') }}</h2>
        <div class="chart-controls">
          <pv-select
              v-model="selectedSector"
              :options="sectorOptions"
              option-label="label"
              option-value="value"
              :placeholder="t('new_report.all_sectors')"
              class="sector-select"
          />
          <pv-button
              :icon="showByType ? 'pi pi-chart-line' : 'pi pi-list'"
              :label="showByType ? t('dashboard.incidents') : t('dashboard.by_type')"
              severity="secondary"
              size="small"
              @click="showByType = !showByType"
          />
          <pv-button
              icon="pi pi-image"
              :label="t('dashboard.export_png')"
              severity="secondary"
              size="small"
              @click="exportChartPNG"
          />
        </div>
      </div>

      <div class="chart-wrapper">
        <rg-chart
            ref="chartRef"
            type="line"
            :data="showByType ? trendByTypeData : trendChartData"
            :options="chartOptions"
        />
      </div>

      <div class="chart-legend-hint">
        <span class="legend-dot" style="background:#EF4444"></span>
        <span>{{ t('dashboard.spike_month') }}</span>
        <span class="legend-dot" style="background:#FF5B00; margin-left:14px"></span>
        <span>{{ t('dashboard.normal_month') }}</span>
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

  <!-- EXECUTIVE SUMMARY PREVIEW -->
  <pv-dialog
      v-model:visible="showPreview"
      :header="t('dashboard.executive_summary_preview')"
      :modal="true"
      :draggable="false"
      style="width: 80vw; max-width: 1000px;"
  >
    <iframe
        v-if="previewUrl"
        :src="previewUrl"
        style="width:100%; height:70vh; border:none; border-radius:6px;"
        title="Resumen ejecutivo"
    />
    <template #footer>
      <pv-button :label="t('common.close')" icon="pi pi-times" severity="secondary" @click="showPreview = false" />
    </template>
  </pv-dialog>

  <!-- SECTOR DETAIL DIALOG -->
  <pv-dialog
      v-model:visible="showSectorDetail"
      :header="sectorDetailData.title"
      :modal="true"
      :draggable="false"
      style="width: 70vw; max-width: 900px;"
  >
    <!-- Sectores criticos: muestra alertas activas por sector -->
    <div v-if="sectorDetailData.mode === 'critical' && sectorDetailData.sectors.length">
      <p class="detail-hint">Sectores con alertas activas no resueltas en este momento.</p>
      <pv-data-table :value="sectorDetailData.sectors" :rows="10">
        <pv-column field="sector" :header="t('predictive_indicators.sector')" />
        <pv-column field="alertas_activas" header="Alertas Activas" style="width:14%">
          <template #body="{ data }">
            <pv-tag :value="String(data.alertas_activas)" severity="danger" />
          </template>
        </pv-column>
        <pv-column field="compliance" header="Cumplimiento SST" style="width:16%">
          <template #body="{ data }">
            <pv-tag
                v-if="data.compliance !== '-'"
                :value="`${data.compliance}%`"
                :severity="data.compliance >= 80 ? 'success' : data.compliance >= 50 ? 'warning' : 'danger'"
            />
            <span v-else>-</span>
          </template>
        </pv-column>
        <pv-column field="estado" :header="t('common.status')">
          <template #body="{ data }">
            <pv-tag
                :value="data.estado"
                :severity="data.estado === 'Critico' ? 'danger' : 'warning'"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>

    <!-- Cumplimiento SST: muestra tabla de plan por sector -->
    <div v-else-if="sectorDetailData.mode === 'compliance' && sectorDetailData.sectors.length">
      <p class="detail-hint">Porcentaje de actividades SST completadas por sector respecto al plan anual.</p>
      <pv-data-table :value="sectorDetailData.sectors" :rows="10">
        <pv-column field="sector" :header="t('predictive_indicators.sector')" />
        <pv-column field="compliance" header="Cumplimiento (%)">
          <template #body="{ data }">
            <pv-tag
                :value="`${data.compliance}%`"
                :severity="data.compliance >= 80 ? 'success' : data.compliance >= 50 ? 'warning' : 'danger'"
            />
          </template>
        </pv-column>
        <pv-column field="completed_activities" header="Completadas" />
        <pv-column field="planned_activities" header="Planificadas" />
        <pv-column field="estado" :header="t('common.status')">
          <template #body="{ data }">
            <pv-tag
                :value="data.estado"
                :severity="data.estado === 'Optimo' ? 'success' : data.estado === 'Aceptable' ? 'warning' : 'danger'"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
    <div v-else-if="sectorDetailData.incidents.length">
      <pv-data-table :value="sectorDetailData.incidents" :rows="10" :paginator="sectorDetailData.incidents.length > 10">
        <pv-column field="id" header="ID" style="width:10%" />
        <pv-column :header="t('my_reports.date')" style="width:14%">
          <template #body="{ data }">{{ new Date(data.date || data.createdAt).toLocaleDateString('es-PE') }}</template>
        </pv-column>
        <pv-column :header="t('predictive_indicators.sector')" style="width:16%">
          <template #body="{ data }">{{ data.section || data.sector || '-' }}</template>
        </pv-column>
        <pv-column :header="t('my_reports.type')">
          <template #body="{ data }">{{ data.incident_type || data.riskType || '-' }}</template>
        </pv-column>
        <pv-column :header="t('common.status')">
          <template #body="{ data }">
            <pv-tag
                :value="data.resolved || ['cerrado', 'resuelto', 'resolved', 'finalizado', 'closed'].includes((data.status || '').toString().toLowerCase()) ? t('notifications.resolved') : t('notifications.unresolved')"
                :severity="data.resolved || ['cerrado', 'resuelto', 'resolved', 'finalizado', 'closed'].includes((data.status || '').toString().toLowerCase()) ? 'success' : 'danger'"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
    <p v-else class="no-detail">{{ t('errors.no_data') }}</p>
    <template #footer>
      <pv-button :label="t('common.close')" icon="pi pi-times" severity="secondary" @click="showSectorDetail = false" />
    </template>
  </pv-dialog>
</template>

<style scoped>
.safe-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 32px;
  color: #22C55E;
  font-weight: 600;
  font-size: 14px;
}
.safe-banner i { font-size: 20px; }

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
  font-family: 'Inter', 'Geist', system-ui, sans-serif;
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

.kpi-card--clickable {
  cursor: pointer;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.no-detail {
  color: var(--text-secondary);
  text-align: center;
  padding: 30px;
}

.detail-hint {
  font-size: 12px;
  color: var(--text-secondary, #9CA3AF);
  margin: 0 0 14px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 6px;
  border-left: 3px solid var(--primary-color, #FF5B00);
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
  background: linear-gradient(135deg, #1A1E24 0%, #0F1115 100%);
  padding: 25px;
  border-radius: 10px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-header h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 20px;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sector-select {
  min-width: 180px;
}

:deep(.sector-select .p-select) {
  background: #111418;
  border-color: var(--border-color);
  font-size: 13px;
}

.chart-wrapper {
  height: 380px;
}

.chart-legend-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
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

/* DARK DIALOGS */

:deep(.p-dialog) {
  background: #1a1e24;
  border: 1px solid var(--border-color, #2a2f38);
  color: var(--text-color);
}

:deep(.p-dialog .p-dialog-header) {
  background: #0f1115;
  color: var(--primary-color, #FF5B00);
  border-bottom: 1px solid var(--border-color, #2a2f38);
  padding: 16px 20px;
}

:deep(.p-dialog .p-dialog-title) {
  color: var(--primary-color, #FF5B00);
  font-weight: 700;
  font-size: 16px;
}

:deep(.p-dialog .p-dialog-header-icon) {
  color: var(--text-secondary, #9CA3AF);
}

:deep(.p-dialog .p-dialog-header-icon:hover) {
  background: rgba(255,255,255,0.08) !important;
  color: #fff !important;
}

:deep(.p-dialog .p-dialog-content) {
  background: #1a1e24;
  color: var(--text-color);
  padding: 20px;
}

:deep(.p-dialog .p-dialog-footer) {
  background: #0f1115;
  border-top: 1px solid var(--border-color, #2a2f38);
  padding: 12px 20px;
}

:deep(.p-dialog .p-datatable) {
  background: transparent;
}

:deep(.p-dialog .p-datatable-thead > tr > th) {
  background: #0f1115;
  color: var(--primary-color, #FF5B00);
  border-color: var(--border-color, #2a2f38);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.p-dialog .p-datatable-tbody > tr) {
  background: #1a1e24;
  color: var(--text-color);
}

:deep(.p-dialog .p-datatable-tbody > tr:nth-child(even)) {
  background: #111418;
}

:deep(.p-dialog .p-datatable-tbody > tr:hover > td) {
  background: rgba(255,91,0,0.06) !important;
}

:deep(.p-dialog .p-datatable-tbody > tr > td) {
  border-color: var(--border-color, #2a2f38);
  font-size: 13px;
}

:deep(.p-dialog .p-paginator) {
  background: #0f1115;
  border-top: 1px solid var(--border-color, #2a2f38);
  color: var(--text-secondary);
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
