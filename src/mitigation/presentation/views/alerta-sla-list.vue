<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAlertaSLAStore } from '@/mitigation/application/alerta-sla.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useAlertaSLAStore()

onMounted(async () => {
  if (!store.loaded) await store.fetchAll()
})

function goToAlert(alerta) {
  router.push(`/mitigation/tickets/${alerta.ticketId}`)
}

function formatElapsedHours(hours) {
  const value = Number(hours || 0)
  if (value < 24) return `${value}h`
  const days = Math.floor(value / 24)
  const remainingHours = value % 24
  return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('alertaSLA.title') }}</span>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.alertas" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="id" header="#" style="width:50px" />
        <pv-column field="ticketId" :header="t('alertaSLA.ticket')" style="width:80px" sortable />
        <pv-column field="horasTranscurridas" :header="t('alertaSLA.hoursElapsed')" style="width:110px">
          <template #body="{ data }">{{ formatElapsedHours(data.horasTranscurridas) }}</template>
        </pv-column>
        <pv-column field="slaLimiteHoras" :header="t('alertaSLA.slaLimit')" style="width:90px" />
        <pv-column field="fechaAlerta" :header="t('alertaSLA.alertDate')" style="width:120px" />
        <pv-column field="notificadoNombre" :header="t('alertaSLA.notifiedTo')" style="width:140px" />
        <pv-column :header="t('common.actions')" style="width:60px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="goToAlert(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
