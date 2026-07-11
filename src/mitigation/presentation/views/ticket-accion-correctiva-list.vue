<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'
import { withSlaEvaluation } from '@/mitigation/application/sla-policy.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useTicketAccionCorrectivaStore()
const searchText = ref('')
const statusFilter = ref(null)
const criticalityFilter = ref(null)
const technicianFilter = ref(null)
const slaFilter = ref(null)

onMounted(async () => {
    if (!store.loaded) await store.fetchAll()
})

function normalizeStatus(status) {
    const value = (status || '').toString().toLowerCase()
    if (value.includes('pendiente') || value.includes('asignado')) return 'Asignado'
    if (value.includes('progreso') || value.includes('ejecucion')) return 'En ejecucion'
    if (value.includes('implementada') || value.includes('reportada')) return 'Mitigacion reportada'
    if (value.includes('verificacion')) return 'En verificacion'
    if (value.includes('cerrado')) return 'Cerrado'
    if (value.includes('reabierto')) return 'Reabierto'
    return status || 'Asignado'
}

const estadoClass = (s) => ({
    'Asignado':'rg-badge rg-badge-gray',
    'En ejecucion':'rg-badge rg-badge-amber',
    'Mitigacion reportada':'rg-badge rg-badge-purple',
    'En verificacion':'rg-badge rg-badge-orange','Cerrado':'rg-badge rg-badge-green',
    'Reabierto':'rg-badge rg-badge-red'
}[s] ?? 'rg-badge rg-badge-gray')

const slaClass = (s) => s ? 'rg-badge rg-badge-red' : 'rg-badge rg-badge-green'
const tickets = computed(() => store.tickets.map(ticket => ({ ...withSlaEvaluation(ticket), estadoFlujo: normalizeStatus(ticket.estado) })).filter(ticket => {
    const query = searchText.value.trim().toLowerCase()
    const matchesText = !query || [
        ticket.id,
        ticket.ticketNumber,
        ticket.sector,
        ticket.tipoRiesgo,
        ticket.nivelCriticidad,
        ticket.tecnicoNombre,
        ticket.estadoFlujo
    ].some(value => (value || '').toString().toLowerCase().includes(query))
    const matchesStatus = !statusFilter.value || ticket.estadoFlujo === statusFilter.value
    const matchesCriticality = !criticalityFilter.value || ticket.nivelCriticidad === criticalityFilter.value
    const matchesTechnician = !technicianFilter.value || ticket.tecnicoNombre === technicianFilter.value
    const matchesSla = slaFilter.value === null || ticket.slaIncumplido === slaFilter.value
    return matchesText && matchesStatus && matchesCriticality && matchesTechnician && matchesSla
}))
const statusOptions = ['Asignado', 'En ejecucion', 'Mitigacion reportada', 'En verificacion', 'Cerrado', 'Reabierto']
const criticalityOptions = ['Tolerable', 'Moderado', 'Importante', 'Critico']
const technicianOptions = computed(() => [...new Set(store.tickets.map(ticket => ticket.tecnicoNombre).filter(Boolean))])
const slaOptions = computed(() => [
    { label: t('common.all'), value: null },
    { label: 'SLA incumplido', value: true },
    { label: 'SLA vigente', value: false }
])

function clearTicketFilters() {
    searchText.value = ''
    statusFilter.value = null
    criticalityFilter.value = null
    technicianFilter.value = null
    slaFilter.value = null
}

const confirmDelete = (ticket) => {
    confirm.require({
        message: 'Eliminar este ticket?', header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(ticket.id).then(() => toast.add({ severity: 'success', summary: 'Ticket eliminado', life: 3000 })).catch((err) => { const msg = err?.response?.data?.detail || err?.response?.data?.title || err?.message || 'No se pudo eliminar el ticket'; toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 5000 }) })
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div>
        <span class="rg-page-title">{{ t('ticketCorrectivo.title') }}</span>
        <div style="color:var(--rg-text-muted);font-size:0.82rem;margin-top:4px">{{ t('ticketCorrectivo.workflowNote') }}</div>
      </div>
      <pv-button :label="t('ticketCorrectivo.new')" icon="pi pi-plus" size="small" @click="router.push('/mitigation/tickets/new')" />
    </div>
    <div class="rg-card" style="margin-bottom:12px">
      <div class="ticket-filters">
        <div class="rg-form-field">
          <label class="rg-label">Buscar</label>
          <pv-input-text v-model="searchText" size="small" placeholder="Ticket, sector, riesgo o tecnico" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('common.status') }}</label>
          <pv-select v-model="statusFilter" :options="statusOptions" size="small" show-clear />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.criticality') }}</label>
          <pv-select v-model="criticalityFilter" :options="criticalityOptions" size="small" show-clear />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.technician') }}</label>
          <pv-select v-model="technicianFilter" :options="technicianOptions" size="small" show-clear />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.sla') }}</label>
          <pv-select v-model="slaFilter" :options="slaOptions" option-label="label" option-value="value" size="small" />
        </div>
        <div class="rg-form-field filter-action">
          <pv-button :label="t('common.clear')" icon="pi pi-filter-slash" size="small" severity="secondary" @click="clearTicketFilters" />
        </div>
      </div>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="tickets" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column header="#" style="width:50px">
          <template #body="{ data }">#{{ data.ticketNumber ?? data.id }}</template>
        </pv-column>
        <pv-column field="sector" :header="t('evaluacionRiesgo.sector')" style="width:130px" sortable />
        <pv-column field="tipoRiesgo" :header="t('ticketCorrectivo.riskType')" style="width:110px" />
        <pv-column field="nivelCriticidad" :header="t('ticketCorrectivo.criticality')" style="width:100px" />
        <pv-column field="tecnicoNombre" :header="t('ticketCorrectivo.technician')" style="width:140px" />
        <pv-column field="estadoFlujo" :header="t('common.status')" style="width:150px">
          <template #body="{ data }"><span :class="estadoClass(data.estadoFlujo)">{{ data.estadoFlujo }}</span></template>
        </pv-column>
        <pv-column field="slaIncumplido" :header="t('ticketCorrectivo.sla')" style="width:70px">
          <template #body="{ data }"><span :class="slaClass(data.slaIncumplido)">{{ data.slaIncumplido ? t('common.yes') : t('common.no') }}</span></template>
        </pv-column>
        <pv-column field="fechaCreacion" :header="t('ticketCorrectivo.createdAt')" style="width:110px" />
        <pv-column :header="t('common.actions')" style="width:110px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/mitigation/tickets/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/mitigation/tickets/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>
.ticket-filters {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) repeat(4, minmax(130px, 1fr)) auto;
  gap: 10px;
  align-items: end;
}

.filter-action {
  justify-content: end;
}

@media (max-width: 1100px) {
  .ticket-filters {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (max-width: 720px) {
  .ticket-filters {
    grid-template-columns: 1fr;
  }
}
</style>
