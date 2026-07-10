<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useVerificacionMedidaStore } from '@/mitigation/application/verificacion-medida.store.js'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useVerificacionMedidaStore()
const ticketStore = useTicketAccionCorrectivaStore()

onMounted(() => {
  if (!store.loaded) store.fetchAll()
  if (!ticketStore.loaded) ticketStore.fetchAll()
})

const veredictoClass = (v) => v === 'Aprobado' ? 'rg-badge rg-badge-green' : v === 'Rechazado' ? 'rg-badge rg-badge-red' : 'rg-badge rg-badge-amber'
const pendingTickets = computed(() => ticketStore.tickets.filter(ticket => {
  const status = (ticket.estado || '').toLowerCase()
  const hasVerdict = store.getByTicketId(ticket.id).some(verification => verification.veredicto)
  return status.includes('verificacion') && !hasVerdict
}))
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div>
        <span class="rg-page-title">{{ t('verificacion.title') }}</span>
        <div style="color:var(--rg-text-muted);font-size:0.82rem;margin-top:4px">{{ t('verificacion.pending') }}</div>
      </div>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="pendingTickets" :loading="!store.loaded || !ticketStore.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column header="#" style="width:70px">
          <template #body="{ data }">#{{ data.ticketNumber || data.id }}</template>
        </pv-column>
        <pv-column field="sector" :header="t('ticketCorrectivo.sector')" />
        <pv-column field="tipoRiesgo" :header="t('ticketCorrectivo.riskType')" />
        <pv-column field="tecnicoNombre" :header="t('ticketCorrectivo.technician')" />
        <pv-column :header="t('verificacion.veredict')" style="width:130px">
          <template #body><span :class="veredictoClass('')">Pendiente</span></template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:120px">
          <template #body="{ data }">
            <pv-button :label="t('verificacion.new')" icon="pi pi-check-circle" size="small" @click="router.push(`/mitigation/verificaciones/new?ticketId=${data.id}`)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
