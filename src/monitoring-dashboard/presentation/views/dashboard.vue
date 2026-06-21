<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'
import KpiCard from '@/monitoring-dashboard/presentation/components/kpi-card.vue'
import HeatMap from '@/monitoring-dashboard/presentation/components/heat-map.vue'

const router = useRouter()
const { t } = useI18n()
const store = useMonitoringStore()

onMounted(() => {
  if (!store.loaded) store.fetchDashboard()
})

function riskSeverity(level) {
  if (level === 'Critico') return 'danger'
  if (level === 'Alto') return 'warn'
  if (level === 'Medio') return 'warn'
  return 'success'
}

function displayTime(ticket) {
  if (ticket.slaStatus === 'SLA Incumplido') {
    return ticket.elapsedTime.replace('restantes', 'excedidos').replace('restante', 'excedida')
  }
  return ticket.elapsedTime
}
</script>

<template>
  <div class="content">
    <div class="status-banner mb-3">
      <i class="pi pi-check-circle mr-2"></i>{{ t('dashboard.status') }}
    </div>
    <div class="mb-3">
      <h1>{{ t('dashboard.title') }}</h1>
    </div>
    <div class="grid">
      <div class="col-12 md:col-6">
        <kpi-card :label="t('dashboard.pendingTickets')" :value="store.pendingTicketsCount" icon="pi pi-inbox" status="warning" />
      </div>
      <div class="col-12 md:col-6">
        <kpi-card :label="t('dashboard.inProgress')" :value="store.inProgressCount" icon="pi pi-spin pi-cog" />
      </div>
    </div>
    <div class="grid mt-2">
      <section class="col-12 lg:col-8">
        <div class="panel p-3 h-full">
          <h3>{{ t('dashboard.heatMap') }}</h3>
          <heat-map :zones="store.heatMapZones" :selected-sector="store.selectedSector" @select-sector="store.selectSector" />
        </div>
      </section>
      <section class="col-12 lg:col-4">
        <div class="panel p-3 h-full">
          <div class="flex justify-content-between align-items-center">
            <h3>{{ t('dashboard.activeAlerts') }}</h3>
            <pv-button icon="pi pi-arrow-right" text rounded @click="router.push('/monitoring/tickets')" />
          </div>
          <p v-if="!store.selectedSector" class="muted">{{ t('dashboard.selectSector') }}</p>
          <div v-for="ticket in store.selectedSector ? store.filteredTickets : []" :key="ticket.id" class="alert-item">
            <div>
              <strong>{{ ticket.code }} - {{ ticket.incidentType }}</strong>
              <p class="muted mb-0">{{ ticket.sector }} / {{ displayTime(ticket) }}</p>
            </div>
            <pv-tag :value="ticket.riskLevel" :severity="riskSeverity(ticket.riskLevel)" />
          </div>
        </div>
      </section>
    </div>
    <section class="panel p-3 mt-3">
      <h3>{{ t('dashboard.pendingTickets') }}</h3>
      <pv-data-table class="table-dark" :value="store.tickets.filter(ticket => ticket.status === 'Pendiente')" :loading="!store.loaded">
        <pv-column field="code" :header="t('tickets.code')" />
        <pv-column field="sector" :header="t('tickets.sector')" />
        <pv-column field="incidentType" :header="t('tickets.incidentType')" />
        <pv-column :header="t('tickets.risk')">
          <template #body="slotProps">
            <pv-tag :value="slotProps.data.riskLevel" :severity="riskSeverity(slotProps.data.riskLevel)" />
          </template>
        </pv-column>
        <pv-column :header="t('tickets.time')">
          <template #body="slotProps">
            {{ displayTime(slotProps.data) }}
          </template>
        </pv-column>
      </pv-data-table>
    </section>
  </div>
</template>

<style scoped>
h1 {
  margin: 0 0 0.3rem;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  background: #151d28;
  border: 1px solid #253246;
  border-radius: 8px;
  padding: 0.9rem;
  margin-bottom: 0.75rem;
}
</style>
