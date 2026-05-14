<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { usePatronRiesgoStore } from '@/risk-assessment/application/patron-riesgo.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = usePatronRiesgoStore()

const patron = computed(() => store.getById(route.params.id))

onMounted(() => { if (!store.loaded) store.fetchAll() })

const revisadaClass = (r) => r ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-amber'

function marcarRevisada() {
    if (!patron.value) return
    store.update({ ...patron.value, revisada: true, fechaRevision: new Date().toISOString().split('T')[0] })
}
</script>

<template>
  <div v-if="patron">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('patronRiesgo.pattern') }} #{{ patron.id }}</span>
      </div>
      <pv-button v-if="!patron.revisada" :label="t('patronRiesgo.markReviewed')" icon="pi pi-check-circle" size="small" severity="success" @click="marcarRevisada" />
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.sector') }}</span><span class="rg-detail-value">{{ patron.sector }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.hazardType') }}</span><span class="rg-detail-value">{{ patron.tipoPeligro }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('common.description') }}</span><span class="rg-detail-value">{{ patron.descripcion }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('patronRiesgo.frequency') }}</span><span class="rg-detail-value">{{ patron.frecuencia }}x</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('patronRiesgo.firstOccurrence') }}</span><span class="rg-detail-value">{{ patron.fechaPrimeraOcurrencia }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('patronRiesgo.period') }}</span><span class="rg-detail-value">{{ patron.periodoAnalisisDias }} días</span></div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('patronRiesgo.reviewed') }}</span>
        <span class="rg-detail-value"><span :class="revisadaClass(patron.revisada)">{{ patron.revisada ? t('common.yes') : t('common.no') }}</span></span>
      </div>
      <div v-if="patron.fechaRevision" class="rg-detail-row"><span class="rg-detail-label">{{ t('patronRiesgo.reviewDate') }}</span><span class="rg-detail-value">{{ patron.fechaRevision }}</span></div>
    </div>
  </div>
</template>
