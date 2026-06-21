<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useVerificacionMedidaStore } from '@/mitigation/application/verificacion-medida.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useVerificacionMedidaStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const veredictoClass = (v) => v === 'Aprobado' ? 'rg-badge rg-badge-green' : v === 'Rechazado' ? 'rg-badge rg-badge-red' : 'rg-badge rg-badge-amber'
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('verificacion.title') }}</span>
      <pv-button :label="t('verificacion.new')" icon="pi pi-plus" size="small" @click="router.push('/mitigation/verificaciones/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.verificaciones" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="id" header="#" style="width:50px" />
        <pv-column field="ticketId" :header="t('verificacion.ticket')" style="width:80px" />
        <pv-column field="supervisorNombre" :header="t('verificacion.supervisor')" style="width:150px" />
        <pv-column field="veredicto" :header="t('verificacion.veredict')" style="width:110px">
          <template #body="{ data }"><span :class="veredictoClass(data.veredicto)">{{ data.veredicto || 'Pendiente' }}</span></template>
        </pv-column>
        <pv-column field="fechaVerificacion" :header="t('verificacion.date')" style="width:120px" />
        <pv-column :header="t('common.actions')" style="width:60px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/mitigation/verificaciones/${data.id}`)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
