<script setup>
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumenDiarioStore } from '@/risk-assessment/application/resumen-diario.store.js'

const { t } = useI18n()
const store = useResumenDiarioStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const totalNuevos = computed(() => store.resumenes.reduce((s, r) => s + r.totalNuevos, 0))
const totalProgreso = computed(() => store.resumenes.reduce((s, r) => s + r.totalEnProgreso, 0))
const totalResueltos = computed(() => store.resumenes.reduce((s, r) => s + r.totalResueltos, 0))

const resumenesHoy = computed(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return store.resumenes.filter(r => r.fecha === hoy)
})
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('resumenDiario.title') }}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px">
      <div class="rg-card" style="text-align:center">
        <div style="font-size:1.8rem;font-weight:700;color:var(--rg-amber)">{{ totalNuevos }}</div>
        <div style="font-size:0.8rem;color:var(--rg-text-muted)">{{ t('resumenDiario.new') }}</div>
      </div>
      <div class="rg-card" style="text-align:center">
        <div style="font-size:1.8rem;font-weight:700;color:var(--rg-tertiary)">{{ totalProgreso }}</div>
        <div style="font-size:0.8rem;color:var(--rg-text-muted)">{{ t('resumenDiario.inProgress') }}</div>
      </div>
      <div class="rg-card" style="text-align:center">
        <div style="font-size:1.8rem;font-weight:700;color:var(--rg-green)">{{ totalResueltos }}</div>
        <div style="font-size:0.8rem;color:var(--rg-text-muted)">{{ t('resumenDiario.resolved') }}</div>
      </div>
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.resumenes" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="fecha" :header="t('resumenDiario.date')" style="width:110px" sortable />
        <pv-column field="sector" :header="t('evaluacionRiesgo.sector')" style="width:140px" sortable />
        <pv-column field="totalNuevos" :header="t('resumenDiario.new')" style="width:90px" />
        <pv-column field="totalEnProgreso" :header="t('resumenDiario.inProgress')" style="width:90px" />
        <pv-column field="totalResueltos" :header="t('resumenDiario.resolved')" style="width:90px" />
      </pv-data-table>
    </div>
  </div>
</template>
