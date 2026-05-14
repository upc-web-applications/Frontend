<script setup>
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useHistorialTicketStore } from '@/mitigation/application/historial-ticket.store.js'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useHistorialTicketStore()
const ticketStore = useTicketAccionCorrectivaStore()
const filtroTicketId = ref(null)

onMounted(() => {
    if (!store.loaded) store.fetchAll()
    if (!ticketStore.loaded) ticketStore.fetchAll()
})

const historialesFiltrados = computed(() => {
    if (filtroTicketId.value) return store.historiales.filter(h => h.ticketId === parseInt(filtroTicketId.value))
    return store.historiales
})

function getTicketEstado(ticketId) {
    const tk = ticketStore.getById(ticketId)
    return tk ? tk.estado : '-'
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
        <label class="rg-label" style="margin:0;white-space:nowrap">{{ t('historialTicket.filterByTicket') }}</label>
        <pv-input-number v-model="filtroTicketId" :min="1" size="small" style="width:150px" />
        <pv-button v-if="filtroTicketId" icon="pi pi-times" size="small" text rounded @click="filtroTicketId = null" />
      </div>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="historialesFiltrados" :loading="!store.loaded" striped-rows size="small" :rows="15" paginator>
        <pv-column field="id" header="#" style="width:50px" />
        <pv-column field="ticketId" :header="t('historialTicket.ticket')" style="width:80px" sortable />
        <pv-column field="evento" :header="t('historialTicket.event')" style="width:150px" />
        <pv-column field="detalles" :header="t('historialTicket.details')" style="min-width:220px" />
        <pv-column field="usuarioNombre" :header="t('historialTicket.user')" style="width:130px" />
        <pv-column field="fecha" :header="t('historialTicket.date')" style="width:110px" sortable />
        <pv-column :header="t('common.actions')" style="width:70px">
          <template #body="{ data }">
            <pv-button v-if="data.ticketId" icon="pi pi-eye" size="small" text rounded severity="info" @click="irATicket(data.ticketId)" v-tooltip.top="'Ver ticket #' + data.ticketId" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
