<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'
import { useInspectionStore } from '@/inspection/application/inspection.store.js'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'
import { useVerificacionMedidaStore } from '@/mitigation/application/verificacion-medida.store.js'
import { useAlertaSLAStore } from '@/mitigation/application/alerta-sla.store.js'
import { withSlaEvaluation } from '@/mitigation/application/sla-policy.js'
import KpiCard from '@/monitoring-dashboard/presentation/components/kpi-card.vue'
import HeatMap from '@/monitoring-dashboard/presentation/components/heat-map.vue'

const router = useRouter()
const { t } = useI18n()
const store = useMonitoringStore()
const inspectionStore = useInspectionStore()
const ticketStore = useTicketAccionCorrectivaStore()
const verificationStore = useVerificacionMedidaStore()
const slaStore = useAlertaSLAStore()

onMounted(async () => {
  if (!store.loaded) store.fetchDashboard()
  if (!inspectionStore.loaded) inspectionStore.fetchAll()
  if (!ticketStore.loaded) await ticketStore.fetchAll()
  await ticketStore.refreshSlaStatus()
  if (!verificationStore.loaded) verificationStore.fetchAll()
  if (!slaStore.loaded) slaStore.fetchAll()
})

function riskSeverity(level) {
  const value = normalizeText(level)
  if (['critico', 'importante'].includes(value)) return 'danger'
  if (['alto', 'moderado', 'medio'].includes(value)) return 'warn'
  return 'success'
}

function displayTime(ticket) {
  if (ticket.slaIncumplido) return `${ticket.slaLimiteHoras || 0}h excedidas`
  return `${ticket.slaLimiteHoras || 0}h limite SLA`
}

function normalizeText(value) {
  return (value || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function normalizeStatus(status) {
  const value = normalizeText(status)
  if (value.includes('recibido') || value.includes('pendiente')) return 'received'
  if (value.includes('revision')) return 'review'
  if (value.includes('convertido')) return 'converted'
  if (value.includes('asignado')) return 'assigned'
  if (value.includes('ejecucion') || value.includes('progreso')) return 'execution'
  if (value.includes('verificacion') || value.includes('implementada') || value.includes('reportada')) return 'verification'
  if (value.includes('cerrado')) return 'closed'
  if (value.includes('reabierto')) return 'reopened'
  return value
}

function ticketCode(ticket) {
  return ticket.ticketNumber ? `#${ticket.ticketNumber}` : `#${ticket.id}`
}

const correctiveTickets = computed(() => ticketStore.tickets.map(ticket => withSlaEvaluation(ticket)))
const activeReports = computed(() => inspectionStore.inspections.filter(report => !['cancelada', 'no procede', 'convertido'].includes(normalizeStatus(report.estado))))
const reportsToAssign = computed(() => activeReports.value.filter(report => ['received', 'review'].includes(normalizeStatus(report.estado))))
const ticketsInExecution = computed(() => correctiveTickets.value.filter(ticket => ['assigned', 'execution', 'reopened'].includes(normalizeStatus(ticket.estado))))
const ticketsInVerification = computed(() => correctiveTickets.value.filter(ticket => normalizeStatus(ticket.estado) === 'verification'))
const pendingVerifications = computed(() => ticketsInVerification.value.filter(ticket => {
  const verifications = verificationStore.getByTicketId(ticket.id)
  return !verifications.some(verification => verification.veredicto)
}))
const slaAlerts = computed(() => {
  const ticketAlerts = correctiveTickets.value.filter(ticket => ticket.slaIncumplido)
  return slaStore.alertas.length ? slaStore.alertas : ticketAlerts
})
const activeCorrectiveTickets = computed(() => correctiveTickets.value.filter(ticket => !['closed'].includes(normalizeStatus(ticket.estado))))
const selectedSectorTickets = computed(() => {
  if (!store.selectedSector) return []
  const sectorName = normalizeText(store.selectedSector.name)
  return activeCorrectiveTickets.value.filter(ticket => {
    const ticketSector = normalizeText(ticket.sector)
    return ticket.sectorId === store.selectedSector.id || ticketSector.includes(sectorName) || sectorName.includes(ticketSector)
  })
})
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
      <div class="col-12 md:col-6 lg:col-3">
        <kpi-card :label="t('dashboard.reportsToReview')" :value="activeReports.length" icon="pi pi-inbox" status="warning" />
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <kpi-card :label="t('dashboard.reportsToAssign')" :value="reportsToAssign.length" icon="pi pi-user-plus" status="warning" />
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <kpi-card :label="t('dashboard.ticketsInExecution')" :value="ticketsInExecution.length" icon="pi pi-spin pi-cog" />
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <kpi-card :label="t('dashboard.pendingVerifications')" :value="pendingVerifications.length" icon="pi pi-check-circle" />
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <kpi-card :label="t('dashboard.slaAlerts')" :value="slaAlerts.length" icon="pi pi-clock" status="danger" />
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
            <pv-button icon="pi pi-arrow-right" text rounded @click="router.push('/mitigation/tickets')" />
          </div>
          <p v-if="!store.selectedSector" class="muted">{{ t('dashboard.selectSector') }}</p>
          <div v-for="ticket in selectedSectorTickets" :key="ticket.id" class="alert-item">
            <div>
              <strong>{{ ticketCode(ticket) }} - {{ ticket.tipoRiesgo }}</strong>
              <p class="muted mb-0">{{ ticket.sector }} / {{ displayTime(ticket) }}</p>
            </div>
            <pv-tag :value="ticket.nivelCriticidad" :severity="riskSeverity(ticket.nivelCriticidad)" />
          </div>
        </div>
      </section>
    </div>
    <section class="panel p-3 mt-3">
      <h3>{{ t('dashboard.receivedReports') }}</h3>
      <p class="muted">{{ t('dashboard.receivedReportsHint') }}</p>
      <pv-data-table class="table-dark" :value="reportsToAssign" :loading="!store.loaded || !inspectionStore.loaded">
        <pv-column :header="t('tickets.code')">
          <template #body="{ data }">{{ data.ticket || `#${data.id}` }}</template>
        </pv-column>
        <pv-column field="tipoIncidente" :header="t('tickets.incidentType')" />
        <pv-column field="nivelUrgencia" :header="t('inspeccion.urgency')" />
        <pv-column :header="t('tickets.time')">
          <template #body="slotProps">
            {{ slotProps.data.slaSugeridoHoras || 24 }}h limite SLA
          </template>
        </pv-column>
        <pv-column :header="t('common.actions')">
          <template #body="{ data }">
            <pv-button :label="t('inspeccion.assignTechnician')" icon="pi pi-user-plus" size="small" @click="router.push(`/mitigation/tickets/new?reporteId=${data.id}`)" />
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
