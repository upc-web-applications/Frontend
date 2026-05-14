<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAlertaPatronStore } from '@/risk-assessment/application/alerta-patron.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useAlertaPatronStore()

const alerta = computed(() => store.getById(route.params.id))

onMounted(() => { if (!store.loaded) store.fetchAll() })

const estadoClass = (e) => e === 'Activa' ? 'rg-badge rg-badge-red' : 'rg-badge rg-badge-green'
</script>

<template>
  <div v-if="alerta">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('alertaPatron.alert') }} #{{ alerta.id }}</span>
      </div>
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.sector') }}</span><span class="rg-detail-value">{{ alerta.sector }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaPatron.riskType') }}</span><span class="rg-detail-value">{{ alerta.tipoRiesgo }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaPatron.occurrences') }}</span><span class="rg-detail-value">{{ alerta.numeroOcurrencias }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaPatron.firstReport') }}</span><span class="rg-detail-value">{{ alerta.fechaPrimerReporte }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaPatron.generatedAt') }}</span><span class="rg-detail-value">{{ alerta.fechaGeneracion }}</span></div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('common.status') }}</span>
        <span class="rg-detail-value"><span :class="estadoClass(alerta.estado)">{{ alerta.estado }}</span></span>
      </div>
    </div>
  </div>
</template>
