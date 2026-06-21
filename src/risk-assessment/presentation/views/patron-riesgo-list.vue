<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePatronRiesgoStore } from '@/risk-assessment/application/patron-riesgo.store.js'

const { t } = useI18n()
const router = useRouter()
const store = usePatronRiesgoStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const frecuenciaClass = (f) => f >= 5 ? 'rg-badge rg-badge-red' : f >= 3 ? 'rg-badge rg-badge-amber' : 'rg-badge rg-badge-green'
const revisadaClass = (r) => r ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-amber'
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('patronRiesgo.title') }}</span>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.patrones" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="id" header="#" style="width:50px" />
        <pv-column field="sector" :header="t('evaluacionRiesgo.sector')" style="width:140px" sortable />
        <pv-column field="tipoPeligro" :header="t('evaluacionRiesgo.hazardType')" style="width:120px" sortable />
        <pv-column field="descripcion" :header="t('common.description')" style="min-width:180px" />
        <pv-column field="frecuencia" :header="t('patronRiesgo.frequency')" style="width:100px">
          <template #body="{ data }"><span :class="frecuenciaClass(data.frecuencia)">{{ data.frecuencia }}x</span></template>
        </pv-column>
        <pv-column field="periodoAnalisisDias" :header="t('patronRiesgo.period')" style="width:90px">
          <template #body="{ data }">{{ data.periodoAnalisisDias }}d</template>
        </pv-column>
        <pv-column field="revisada" :header="t('patronRiesgo.reviewed')" style="width:90px">
          <template #body="{ data }"><span :class="revisadaClass(data.revisada)">{{ data.revisada ? t('common.yes') : t('common.no') }}</span></template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:60px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/risk-assessment/patrones/${data.id}`)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
