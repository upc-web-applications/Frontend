<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'

const { t } = useI18n()
const store = useMonitoringStore()

const selectedSector = ref(null)
const startDate = ref('2025-09-01')
const endDate = ref('2025-10-31')
const format = ref('PDF')
const formatOptions = ['PDF', 'EXCEL']

const sectorOptions = computed(() => [
  { label: t('common.all'), value: null },
  ...store.sectors.map(sector => ({ label: sector.name, value: sector.name }))
])

const filteredReports = computed(() => {
  return store.resolvedIncidentReports.filter(report => {
    const sectorMatch = !selectedSector.value || report.sectorName === selectedSector.value
    const startMatch = !startDate.value || report.date >= startDate.value
    const endMatch = !endDate.value || report.date <= endDate.value
    return sectorMatch && startMatch && endMatch
  })
})

onMounted(() => {
  if (!store.loaded) store.fetchDashboard()
})

function statusSeverity(status) {
  return status === 'Inactivo' ? 'danger' : 'success'
}

function clearReportFilters() {
  selectedSector.value = null
  startDate.value = ''
  endDate.value = ''
  format.value = 'PDF'
}
</script>

<template>
  <div class="content">
    <div class="status-banner mb-4">
      <i class="pi pi-check-circle mr-2"></i>{{ t('dashboard.status') }}
    </div>

    <div class="reports-wrapper">
      <section class="panel p-4">
        <div class="report-header">
          <h1 class="section-title">{{ t('reports.resolvedIncidents') }}</h1>
          <pv-button :label="t('reports.download')" class="orange-button download-button" />
        </div>
        <pv-data-table class="table-dark" :value="filteredReports" :loading="!store.loaded" paginator :rows="4">
          <pv-column field="code" header="ID" />
          <pv-column field="date" :header="t('reports.date')" />
          <pv-column field="sectorName" :header="t('tickets.sector')" />
          <pv-column :header="t('tickets.status')">
            <template #body="slotProps">
              <pv-tag :value="slotProps.data.sectorStatus" :severity="statusSeverity(slotProps.data.sectorStatus)" />
            </template>
          </pv-column>
          <pv-column :header="t('reports.details')">
            <template #body>
              <pv-button icon="pi pi-eye" rounded text :aria-label="t('reports.patternsButton')" />
            </template>
          </pv-column>
        </pv-data-table>
      </section>

      <section class="panel p-4 mt-4">
        <h1 class="section-title">{{ t('reports.filters') }}</h1>
        <div class="report-filters">
          <div class="filter-control">
            <label>{{ t('tickets.sector') }}</label>
            <pv-select v-model="selectedSector" :options="sectorOptions" option-label="label" option-value="value" :placeholder="t('common.all')" class="w-full" />
          </div>
          <div class="filter-control">
            <label>{{ t('reports.start') }}</label>
            <input v-model="startDate" class="date-input" type="date" />
          </div>
          <div class="filter-control">
            <label>{{ t('reports.end') }}</label>
            <input v-model="endDate" class="date-input" type="date" />
          </div>
          <div class="filter-control format-control">
            <label>{{ t('reports.format') }}</label>
            <pv-select-button v-model="format" :options="formatOptions" />
          </div>
          <pv-button :label="t('reports.clearFilters')" icon="pi pi-filter-slash" class="clear-button" @click="clearReportFilters" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.reports-wrapper {
  width: min(1060px, 100%);
}

.section-title {
  color: #ff5b00;
  font-size: 0.82rem;
  text-transform: uppercase;
  margin: 0 0 0.8rem;
}

.report-filters {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1.2fr auto;
  gap: 1rem;
  align-items: end;
}

.filter-control {
  display: block;
}

label {
  color: #e4e9f2;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.35rem;
}

.date-input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #263142;
  border-radius: 6px;
  background: #070d17;
  color: #e6ebf5;
  padding: 0.6rem;
}

.report-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.8rem;
}

.report-header .section-title {
  margin: 0;
}

.download-button,
.clear-button {
  min-height: 42px;
}

.clear-button {
  background: #111821 !important;
  border-color: #ff5b00 !important;
  color: #ff5b00 !important;
}

@media (max-width: 1000px) {
  .report-filters {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .report-filters {
    grid-template-columns: 1fr;
  }

  .report-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
