<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAlertaPatronStore } from '@/risk-assessment/application/alerta-patron.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useAlertaPatronStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const estadoClass = (e) => e === 'Activa' ? 'rg-badge rg-badge-red' : 'rg-badge rg-badge-green'
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('alertaPatron.title') }}</span>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.alertas" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="sector" :header="t('evaluacionRiesgo.sector')" style="width:140px" sortable />
        <pv-column field="tipoRiesgo" :header="t('alertaPatron.riskType')" style="width:120px" />
        <pv-column field="numeroOcurrencias" :header="t('alertaPatron.occurrences')" style="width:100px" />
        <pv-column field="fechaPrimerReporte" :header="t('alertaPatron.firstReport')" style="width:130px" />
        <pv-column field="fechaGeneracion" :header="t('alertaPatron.generatedAt')" style="width:130px" />
        <pv-column field="estado" :header="t('common.status')" style="width:90px">
          <template #body="{ data }"><span :class="estadoClass(data.estado)">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:60px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/risk-assessment/alertas-patron/${data.id}`)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
