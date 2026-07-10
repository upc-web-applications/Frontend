<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useMonitoringStore()

const riskOptions = computed(() => [
  { label: t('common.all'), value: null },
  { label: t('common.low'), value: 'Bajo' },
  { label: t('common.medium'), value: 'Medio' },
  { label: t('common.high'), value: 'Alto' },
  { label: t('common.critical'), value: 'Critico' }
])

const statusOptions = computed(() => [
  { label: t('common.all'), value: null },
  { label: t('common.pending'), value: 'Pendiente' },
  { label: t('common.progress'), value: 'En ejecucion' },
  { label: t('common.closed'), value: 'Cerrado' }
])

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

function navigateToAssignment(ticket) {
  const routeName = ticket.assignedTechnician ? 'monitoring-ticket-assignment' : 'monitoring-ticket-assign'
  router.push({ name: routeName, params: { id: ticket.id } })
}
</script>

<template>
  <div class="content">
    <div class="status-banner mb-4">
      <i class="pi pi-check-circle mr-2"></i>{{ t('dashboard.status') }}
    </div>

    <section class="ticket-summary panel p-3 mb-4">
      <span>{{ t('tickets.totalIncidents') }}</span>
      <strong>{{ store.filteredTickets.length }}</strong>
    </section>

    <section class="panel p-4">
      <h1 class="section-title">{{ t('tickets.incidents') }}</h1>
      <pv-data-table class="table-dark ticket-table" :value="store.filteredTickets" :loading="!store.loaded" paginator :rows="6">
        <template #empty>
          <div class="empty-filter-message">
            <i class="pi pi-search"></i>
            <span>{{ t('tickets.noFilterResults') }}</span>
          </div>
        </template>
        <pv-column field="code" :header="t('tickets.code')" sortable />
        <pv-column field="sector" :header="t('tickets.sector')" sortable />
        <pv-column :header="t('tickets.risk')">
          <template #body="slotProps">
            <pv-tag :value="slotProps.data.riskLevel" :severity="riskSeverity(slotProps.data.riskLevel)" />
          </template>
        </pv-column>
        <pv-column :header="t('tickets.status')">
          <template #body="slotProps">
            <div class="flex gap-2 align-items-center">
              <span>{{ slotProps.data.status }}</span>
              <pv-tag v-if="slotProps.data.slaStatus === 'SLA Incumplido'" value="SLA Incumplido" severity="danger" />
            </div>
          </template>
        </pv-column>
        <pv-column :header="t('tickets.time')">
          <template #body="slotProps">
            {{ displayTime(slotProps.data) }}
          </template>
        </pv-column>
        <pv-column :header="t('tickets.actions')">
          <template #body="slotProps">
            <pv-button
              v-if="!slotProps.data.assignedTechnician"
              icon="pi pi-plus"
              rounded
              text
              :aria-label="t('tickets.assign')"
              @click="navigateToAssignment(slotProps.data)" />
            <pv-button
              v-else
              icon="pi pi-eye"
              rounded
              text
              :aria-label="t('tickets.view')"
              @click="navigateToAssignment(slotProps.data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </section>

    <section class="panel p-4 mt-4">
      <div class="flex justify-content-between align-items-center mb-3">
        <h2 class="filter-title">Filtros</h2>
        <pv-button icon="pi pi-filter-slash" class="orange-button" rounded @click="store.clearFilters" />
      </div>
      <div class="grid mb-3">
        <div class="col-12 md:col-4">
          <label>{{ t('tickets.sector') }}:</label>
          <pv-select v-model="store.selectedSector" :options="store.sectors" option-label="name" placeholder="Todos" class="w-full" show-clear />
        </div>
        <div class="col-12 md:col-4">
          <label>{{ t('tickets.risk') }}:</label>
          <pv-select v-model="store.filterRisk" :options="riskOptions" option-label="label" option-value="value" class="w-full" />
        </div>
        <div class="col-12 md:col-4">
          <label>{{ t('tickets.status') }}:</label>
          <pv-select v-model="store.filterStatus" :options="statusOptions" option-label="label" option-value="value" class="w-full" />
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.35rem;
  color: #e4e9f2;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
}

.ticket-summary {
  width: min(520px, 100%);
  min-height: 74px;
}

.ticket-summary span {
  display: block;
  color: #687386;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.ticket-summary strong {
  font-size: 1.6rem;
}

.section-title,
.filter-title {
  color: #ff5b00;
  font-size: 0.9rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.empty-filter-message {
  min-height: 120px;
  display: grid;
  place-items: center;
  gap: 0.7rem;
  color: #aab4c4;
  text-align: center;
  padding: 1.2rem;
}

.empty-filter-message i {
  color: #ff5b00;
  font-size: 1.8rem;
}

</style>
