<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useInspectionStore } from '@/inspection/application/inspection.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSiteStore } from '@/site/application/site.store.js'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useInspectionStore()
const areaStore = useAreaStore()
const siteStore = useSiteStore()
const identityStore = useIdentityAccessStore()
const searchText = ref('')
const statusFilter = ref(null)
const urgencyFilter = ref(null)
const areaFilter = ref(null)

onMounted(() => {
  if (!store.loaded) store.fetchAll(identityStore.currentRole?.code === 'plant-operator' ? identityStore.currentUser?.id : null)
  if (!areaStore.loaded) areaStore.fetchAll()
  if (!siteStore.loaded) siteStore.fetchAll()
})

const isSupervisor = computed(() => identityStore.currentRole?.code === 'supervisor')
const visibleInspections = computed(() => {
  const inspections = isSupervisor.value
    ? store.inspections.filter(inspection => inspection.estado !== 'Cancelada')
    : store.inspections
  return inspections.filter(inspection => {
    if (!isSupervisor.value) return true
    const query = searchText.value.trim().toLowerCase()
    const matchesText = !query || [
      inspection.ticket,
      inspection.tipoIncidente,
      inspection.descripcion,
      areaName(inspection.areaId),
      inspection.estado
    ].some(value => (value || '').toString().toLowerCase().includes(query))
    const matchesStatus = !statusFilter.value || inspection.estado === statusFilter.value
    const matchesUrgency = !urgencyFilter.value || inspection.nivelUrgencia === urgencyFilter.value
    const matchesArea = !areaFilter.value || inspection.areaId === areaFilter.value
    return matchesText && matchesStatus && matchesUrgency && matchesArea
  }).sort((a, b) => {
    const urgencyDelta = urgencyWeight(b.nivelUrgencia) - urgencyWeight(a.nivelUrgencia)
    if (urgencyDelta !== 0) return urgencyDelta
    return new Date(b.fechaReporte || 0).getTime() - new Date(a.fechaReporte || 0).getTime()
  })
})

const pendientes = computed(() => visibleInspections.value.filter(inspection => ['Recibido', 'Pendiente'].includes(inspection.estado)).length)
const enRevision = computed(() => visibleInspections.value.filter(inspection => inspection.estado === 'En revision').length)
const convertidos = computed(() => visibleInspections.value.filter(inspection => ['Convertido a ticket', 'Resuelto'].includes(inspection.estado)).length)
const cancelados = computed(() => store.inspections.filter(inspection => inspection.estado === 'Cancelada').length)

const areaName = (id) => areaStore.areas.find(area => area.id === id)?.nombre ?? '-'
const areaOptions = computed(() => areaStore.areas.filter(area => area.estado === 'Activo').map(area => ({ label: area.nombre, value: area.id })))
const statusOptions = ['Recibido', 'En revision', 'Convertido a ticket', 'No procede']
const urgencyOptions = ['Alto', 'Medio', 'Bajo']
const urgencyWeight = (urgency) => ({ Alto: 3, Medio: 2, Bajo: 1 }[urgency] ?? 0)
const urgencyClass = (urgency) => ({ Alto: 'rg-badge rg-badge-red', Medio: 'rg-badge rg-badge-amber', Bajo: 'rg-badge rg-badge-green' }[urgency] ?? 'rg-badge rg-badge-gray')
const statusClass = (status) => ({
  Recibido: 'rg-badge rg-badge-amber',
  Pendiente: 'rg-badge rg-badge-amber',
  'En revision': 'rg-badge rg-badge-orange',
  'Convertido a ticket': 'rg-badge rg-badge-purple',
  Resuelto: 'rg-badge rg-badge-green',
  Cancelada: 'rg-badge rg-badge-gray',
  'No procede': 'rg-badge rg-badge-gray'
}[status] ?? 'rg-badge rg-badge-gray')
const suggestedSla = (inspection) => inspection.slaSugeridoHoras ? `${inspection.slaSugeridoHoras}h` : ({ Alto: '8h', Medio: '24h', Bajo: '72h' }[inspection.nivelUrgencia] ?? '24h')
const fmtDate = (date) => date ? new Date(date).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'
const canAssign = (inspection) => isSupervisor.value && ['Recibido', 'Pendiente', 'En revision'].includes(inspection.estado)

function clearSupervisorFilters() {
  searchText.value = ''
  statusFilter.value = null
  urgencyFilter.value = null
  areaFilter.value = null
}

function confirmCancel(inspection) {
  confirm.require({
    message: t('inspeccion.cancelConfirm'),
    header: t('common.confirm'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => store.cancel(inspection.id)
      .then(() => toast.add({ severity: 'success', summary: t('inspeccion.cancelSuccess'), life: 3000 }))
      .catch(() => toast.add({ severity: 'error', summary: t('common.error'), life: 3000 }))
  })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ isSupervisor ? t('nav.receivedReports') : t('inspeccion.title') }}</span>
      <pv-button v-if="!isSupervisor" :label="t('inspeccion.new')" icon="pi pi-plus" size="small" @click="router.push('/inspection/new')" />
    </div>

    <div class="rg-stats-row">
      <div class="rg-stat-card">
        <div class="rg-stat-num" style="color:var(--rg-amber)">{{ pendientes }}</div>
        <div><div class="rg-stat-lbl">{{ isSupervisor ? t('inspeccion.received') : t('inspeccion.pending') }}</div></div>
      </div>
      <div class="rg-stat-card">
        <div class="rg-stat-num" style="color:var(--rg-primary)">{{ enRevision }}</div>
        <div><div class="rg-stat-lbl">{{ t('inspeccion.inReview') }}</div></div>
      </div>
      <div class="rg-stat-card">
        <div class="rg-stat-num" style="color:var(--rg-green)">{{ convertidos }}</div>
        <div><div class="rg-stat-lbl">{{ t('inspeccion.convertedToTicket') }}</div></div>
      </div>
      <div v-if="!isSupervisor" class="rg-stat-card">
        <div class="rg-stat-num" style="color:var(--rg-text-muted)">{{ cancelados }}</div>
        <div><div class="rg-stat-lbl">{{ t('inspeccion.cancelled') }}</div></div>
      </div>
    </div>

    <div v-if="isSupervisor" class="rg-card" style="margin-bottom:12px">
      <div class="supervisor-filters">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('common.search') }}</label>
          <pv-input-text v-model="searchText" size="small" placeholder="Ticket, tipo, area o descripcion" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('common.status') }}</label>
          <pv-select v-model="statusFilter" :options="statusOptions" size="small" show-clear />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.urgency') }}</label>
          <pv-select v-model="urgencyFilter" :options="urgencyOptions" size="small" show-clear />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.area') }}</label>
          <pv-select v-model="areaFilter" :options="areaOptions" option-label="label" option-value="value" size="small" show-clear />
        </div>
        <div class="rg-form-field filter-action">
          <pv-button :label="t('common.clear')" icon="pi pi-filter-slash" size="small" severity="secondary" @click="clearSupervisorFilters" />
        </div>
      </div>
    </div>

    <div class="rg-table-wrap">
      <pv-data-table :value="visibleInspections" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="ticket" :header="t('inspeccion.ticket')" style="width:120px">
          <template #body="{ data }"><span style="font-weight:700;color:var(--rg-primary)">{{ data.ticket }}</span></template>
        </pv-column>
        <pv-column field="tipoIncidente" :header="t('inspeccion.type')" sortable />
        <pv-column :header="t('inspeccion.area')" style="width:160px">
          <template #body="{ data }">{{ areaName(data.areaId) }}</template>
        </pv-column>
        <pv-column field="nivelUrgencia" :header="t('inspeccion.urgency')" style="width:100px">
          <template #body="{ data }"><span :class="urgencyClass(data.nivelUrgencia)">{{ data.nivelUrgencia }}</span></template>
        </pv-column>
        <pv-column :header="t('inspeccion.suggestedSla')" style="width:110px">
          <template #body="{ data }">{{ suggestedSla(data) }}</template>
        </pv-column>
        <pv-column field="estado" :header="t('inspeccion.status')" style="width:145px">
          <template #body="{ data }"><span :class="statusClass(data.estado)">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column :header="t('inspeccion.reportDate')" style="width:160px">
          <template #body="{ data }">{{ fmtDate(data.fechaReporte) }}</template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:90px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/inspection/${data.id}`)" />
            <pv-button v-if="canAssign(data)" icon="pi pi-user-plus" size="small" text rounded severity="warn" @click="router.push(`/mitigation/tickets/new?reporteId=${data.id}`)" />
            <pv-button v-if="!isSupervisor && data.estado !== 'Cancelada'" icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmCancel(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>
.supervisor-filters {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) repeat(3, minmax(140px, 1fr)) auto;
  gap: 10px;
  align-items: end;
}

.filter-action {
  justify-content: end;
}

@media (max-width: 980px) {
  .supervisor-filters {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .supervisor-filters {
    grid-template-columns: 1fr;
  }
}
</style>
