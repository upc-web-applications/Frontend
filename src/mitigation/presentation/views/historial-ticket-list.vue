<script setup>
import { onMounted, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useHistorialTicketStore } from '@/mitigation/application/historial-ticket.store.js'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useHistorialTicketStore()
const ticketStore = useTicketAccionCorrectivaStore()
const filtroTexto = ref('')
const expandedTicket = ref(null)
const loading = ref(true)

onMounted(async () => {
    loading.value = true
    try {
        if (!ticketStore.loaded) await ticketStore.fetchAll()
        if (!store.loaded) await store.fetchAll()
    } catch { loading.value = false }
    loading.value = false
})

const ticketsConHistorial = computed(() => {
    const historialesPorTicket = {}
    store.historiales.forEach(h => {
        if (!historialesPorTicket[h.ticketId]) historialesPorTicket[h.ticketId] = []
        historialesPorTicket[h.ticketId].push(h)
    })

    return ticketStore.tickets
        .filter(t => {
            if (!filtroTexto.value) return true
            const q = filtroTexto.value.toLowerCase()
            return String(t.ticketNumber ?? t.id).includes(q) || (t.sector || '').toLowerCase().includes(q) || (t.tipoRiesgo || '').toLowerCase().includes(q)
        })
        .map(t => ({
            ticketId: t.id,
            ticketNumber: t.ticketNumber,
            sector: t.sector || '-',
            tipoRiesgo: t.tipoRiesgo || '-',
            estado: t.estado || '-',
            entradas: historialesPorTicket[t.id] || []
        }))
        .sort((a, b) => (b.ticketNumber ?? b.ticketId) - (a.ticketNumber ?? a.ticketId))
})

const estadoClass = (s) => ({
    'Pendiente':'rg-badge rg-badge-gray','En Progreso':'rg-badge rg-badge-amber',
    'Medida Implementada':'rg-badge rg-badge-purple','Cerrado':'rg-badge rg-badge-green',
    'SLA Incumplido':'rg-badge rg-badge-red','Escalado':'rg-badge rg-badge-red'
}[s] ?? 'rg-badge rg-badge-gray')

function toggleExpand(ticketId) {
    expandedTicket.value = expandedTicket.value === ticketId ? null : ticketId
}

function irATicket(ticketId) {
    if (ticketId) router.push(`/mitigation/tickets/${ticketId}`)
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('historialTicket.title') }}</span>
    </div>
    <div class="rg-card" style="margin-bottom:12px;padding:12px">
      <div style="display:flex;gap:8px;align-items:center">
        <label class="rg-label" style="margin:0;white-space:nowrap">{{ t('common.search') }}</label>
        <pv-input-text v-model="filtroTexto" size="small" style="width:250px" placeholder="Buscar por #, sector, tipo..." />
        <pv-button v-if="filtroTexto" icon="pi pi-times" size="small" text rounded @click="filtroTexto = ''" />
      </div>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="ticketsConHistorial" :loading="loading" striped-rows size="small" :rows="15" paginator>
        <pv-column header="#" style="width:60px" sortable>
          <template #body="{ data }">#{{ data.ticketNumber ?? data.ticketId }}</template>
        </pv-column>
        <pv-column :header="t('evaluacionRiesgo.sector')" style="width:130px">
          <template #body="{ data }">{{ data.sector }}</template>
        </pv-column>
        <pv-column :header="t('ticketCorrectivo.riskType')" style="width:120px">
          <template #body="{ data }">{{ data.tipoRiesgo }}</template>
        </pv-column>
        <pv-column :header="t('common.status')" style="width:120px">
          <template #body="{ data }"><span :class="estadoClass(data.estado)">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column :header="t('historialTicket.events')" style="width:100px">
          <template #body="{ data }">
            <span v-if="data.entradas.length === 0" style="color:var(--rg-text-muted);font-size:0.78rem">Sin historial</span>
            <span v-else>{{ data.entradas.length }} evento{{ data.entradas.length !== 1 ? 's' : '' }}</span>
          </template>
        </pv-column>
        <pv-column :header="t('historialTicket.lastDate')" style="width:110px">
          <template #body="{ data }">
            <span v-if="data.entradas.length">{{ data.entradas[data.entradas.length - 1].fecha }}</span>
            <span v-else style="color:var(--rg-text-muted)">-</span>
          </template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:120px">
          <template #body="{ data }">
            <pv-button v-if="data.entradas.length" icon="pi pi-history" size="small" text rounded severity="info" @click="toggleExpand(data.ticketId)" v-tooltip.top="'Ver historial'" />
            <pv-button icon="pi pi-eye" size="small" text rounded @click="irATicket(data.ticketId)" v-tooltip.top="'Ir al ticket'" />
          </template>
        </pv-column>
        <template #expansion="slotProps">
          <div v-if="expandedTicket === slotProps.data.ticketId && slotProps.data.entradas.length" style="padding:12px;background:var(--rg-bg-alt, #f8f9fa)">
            <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">{{ t('historialTicket.title') }} — #{{ slotProps.data.ticketNumber ?? slotProps.data.ticketId }}</div>
            <div v-for="h in slotProps.data.entradas" :key="h.id" style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--rg-border);font-size:0.8rem">
              <div style="min-width:120px;color:var(--rg-text-muted)">{{ h.fecha }}</div>
              <div style="min-width:120px;font-weight:600">{{ h.evento }}</div>
              <div style="flex:1;color:var(--rg-text-muted)">{{ h.detalles }}</div>
              <div style="min-width:100px;color:var(--rg-text-muted);text-align:right">{{ h.usuarioNombre }}</div>
            </div>
          </div>
          <div v-else-if="expandedTicket === slotProps.data.ticketId" style="padding:12px;background:var(--rg-bg-alt, #f8f9fa);color:var(--rg-text-muted);font-size:0.82rem">
            {{ t('common.noData') }}
          </div>
        </template>
      </pv-data-table>
    </div>
  </div>
</template>