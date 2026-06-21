<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useTicketAccionCorrectivaStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const estadoClass = (s) => ({
    'Pendiente':'rg-badge rg-badge-gray','En Progreso':'rg-badge rg-badge-amber',
    'Medida Implementada':'rg-badge rg-badge-purple','Cerrado':'rg-badge rg-badge-green',
    'SLA Incumplido':'rg-badge rg-badge-red','Escalado':'rg-badge rg-badge-red'
}[s] ?? 'rg-badge rg-badge-gray')

const slaClass = (s) => s ? 'rg-badge rg-badge-red' : 'rg-badge rg-badge-green'

const confirmDelete = (ticket) => {
    confirm.require({
        message: '¿Eliminar este ticket?', header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(ticket.id).then(() => toast.add({ severity: 'success', summary: 'Ticket eliminado', life: 3000 })).catch(() => toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el ticket', life: 5000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('ticketCorrectivo.title') }}</span>
      <pv-button :label="t('ticketCorrectivo.new')" icon="pi pi-plus" size="small" @click="router.push('/mitigation/tickets/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.tickets" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column header="#" style="width:50px">
          <template #body="{ data }">#{{ data.ticketNumber ?? data.id }}</template>
        </pv-column>
        <pv-column field="sector" :header="t('evaluacionRiesgo.sector')" style="width:130px" sortable />
        <pv-column field="tipoRiesgo" :header="t('ticketCorrectivo.riskType')" style="width:110px" />
        <pv-column field="nivelCriticidad" :header="t('ticketCorrectivo.criticality')" style="width:100px" />
        <pv-column field="tecnicoNombre" :header="t('ticketCorrectivo.technician')" style="width:140px" />
        <pv-column field="estado" :header="t('common.status')" style="width:130px">
          <template #body="{ data }"><span :class="estadoClass(data.estado)">{{ data.estado }}</span></template>
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
