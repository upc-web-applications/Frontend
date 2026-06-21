<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useNotificacionCriticaStore } from '@/mitigation/application/notificacion-critica.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useNotificacionCriticaStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const enviadaClass = (e) => e ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-amber'
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('notificacionCritica.title') }}</span>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.notificaciones" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="id" header="#" style="width:50px" />
        <pv-column field="ticketId" :header="t('notificacionCritica.ticket')" style="width:80px" sortable />
        <pv-column field="mensaje" :header="t('notificacionCritica.message')" style="min-width:250px" />
        <pv-column field="supervisorNombre" :header="t('notificacionCritica.supervisor')" style="width:150px" />
        <pv-column field="enviada" :header="t('notificacionCritica.sent')" style="width:70px">
          <template #body="{ data }"><span :class="enviadaClass(data.enviada)">{{ data.enviada ? t('common.yes') : t('common.no') }}</span></template>
        </pv-column>
        <pv-column field="fechaEnvio" :header="t('notificacionCritica.sendDate')" style="width:120px" />
        <pv-column :header="t('common.actions')" style="width:60px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/mitigation/notificaciones-criticas/${data.id}`)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
