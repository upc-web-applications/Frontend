<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useRiskAssessmentStore } from '@/risk-assessment/application/risk-assessment.store.js'
import { useMitigationStore } from '@/mitigation/application/mitigation.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useRiskAssessmentStore()
const mitigationStore = useMitigationStore()

const assessment = computed(() => store.getById(route.params.id))
const mitigations = computed(() => mitigationStore.mitigations.filter(m => m.riskAssessmentId === parseInt(route.params.id)))

const riskClass = (n) => ({ 'Bajo':'rg-badge rg-badge-green','Medio':'rg-badge rg-badge-amber','Alto':'rg-badge rg-badge-red','Critico':'rg-badge rg-badge-red' }[n] ?? 'rg-badge rg-badge-gray')
const mitStatusClass = (s) => ({
    'En ejecucion': 'rg-badge rg-badge-amber',
    'Mitigacion reportada': 'rg-badge rg-badge-purple',
    'En verificacion': 'rg-badge rg-badge-orange',
    'Cerrado': 'rg-badge rg-badge-green'
}[s] ?? 'rg-badge rg-badge-gray')

onMounted(() => {
    if (!store.loaded) store.fetchAll()
    if (!mitigationStore.loaded) mitigationStore.fetchAll()
})
</script>

<template>
  <div v-if="assessment">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ assessment.codigo }}</span>
      </div>
      <div style="display:flex;gap:8px">
        <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/risk-assessment/${assessment.id}/edit`)" />
        <pv-button :label="t('mitigacion.newFromAssess')" icon="pi pi-shield" size="small" severity="warn" @click="router.push(`/mitigation/new?assessmentId=${assessment.id}`)" />
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="rg-card">
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.code') }}</span><span class="rg-detail-value">{{ assessment.codigo }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.sector') }}</span><span class="rg-detail-value">{{ assessment.sector }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.hazardType') }}</span><span class="rg-detail-value">{{ assessment.tipoPeligro }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.description') }}</span><span class="rg-detail-value">{{ assessment.descripcion }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.probability') }}</span><span class="rg-detail-value">{{ assessment.probabilidad }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.severity') }}</span><span class="rg-detail-value">{{ assessment.severidad }}</span></div>
        <div class="rg-detail-row">
          <span class="rg-detail-label">{{ t('evaluacionRiesgo.riskLevel') }}</span>
          <span class="rg-detail-value"><span :class="riskClass(assessment.nivelRiesgo)">{{ assessment.nivelRiesgo }}</span></span>
        </div>
        <div class="rg-detail-row">
          <span class="rg-detail-label">{{ t('evaluacionRiesgo.status') }}</span>
          <span class="rg-detail-value"><span :class="assessment.estado==='Evaluado'?'rg-badge rg-badge-green':assessment.estado==='En Evaluacion'?'rg-badge rg-badge-amber':assessment.estado==='Cerrado'?'rg-badge rg-badge-purple':'rg-badge rg-badge-gray'">{{ assessment.estado }}</span></span>
        </div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.date') }}</span><span class="rg-detail-value">{{ assessment.fechaEvaluacion }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.controlMeasures') }}</span><span class="rg-detail-value">{{ assessment.medidasControl || '-' }}</span></div>
      </div>
      <div class="rg-card">
        <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">{{ t('nav.mitigaciones') }}</div>
        <div v-for="mit in mitigations" :key="mit.id" class="rg-detail-row" style="cursor:pointer" @click="router.push(`/mitigation/${mit.id}`)">
          <span class="rg-detail-label">{{ mit.codigo }}</span>
          <span class="rg-detail-value" style="display:flex;align-items:center;justify-content:space-between">
            {{ mit.descripcion.substring(0, 40) }}...<span :class="mitStatusClass(mit.estado)">{{ mit.estado }}</span>
          </span>
        </div>
        <div v-if="!mitigations.length" style="color:var(--rg-text-muted);font-size:0.82rem">{{ t('common.noData') }}</div>
      </div>
    </div>
  </div>
</template>
