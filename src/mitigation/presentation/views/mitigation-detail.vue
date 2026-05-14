<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useMitigationStore } from '@/mitigation/application/mitigation.store.js'
import { useRiskAssessmentStore } from '@/risk-assessment/application/risk-assessment.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useMitigationStore()
const assessmentStore = useRiskAssessmentStore()

const mitigation = computed(() => store.getById(route.params.id))
const assessment = computed(() => assessmentStore.assessments.find(a => a.id === mitigation.value?.riskAssessmentId))

const statusClass = (s) => ({ 'Pendiente':'rg-badge rg-badge-gray','En Progreso':'rg-badge rg-badge-amber','Implementado':'rg-badge rg-badge-purple','Verificado':'rg-badge rg-badge-green','Cerrado':'rg-badge rg-badge-green' }[s] ?? 'rg-badge rg-badge-gray')
const resultClass = (r) => r === 'Aprobado' ? 'rg-badge rg-badge-green' : r === 'Rechazado' ? 'rg-badge rg-badge-red' : ''

onMounted(() => {
    if (!store.loaded) store.fetchAll()
    if (!assessmentStore.loaded) assessmentStore.fetchAll()
})
</script>

<template>
  <div v-if="mitigation">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ mitigation.codigo }}</span>
      </div>
      <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/mitigation/${mitigation.id}/edit`)" />
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="rg-card">
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('mitigacion.code') }}</span><span class="rg-detail-value">{{ mitigation.codigo }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('mitigacion.description') }}</span><span class="rg-detail-value">{{ mitigation.descripcion }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('mitigacion.responsable') }}</span><span class="rg-detail-value">{{ mitigation.responsable }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('mitigacion.assignedDate') }}</span><span class="rg-detail-value">{{ mitigation.fechaAsignacion }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('mitigacion.executionDate') }}</span><span class="rg-detail-value">{{ mitigation.fechaEjecucion || '-' }}</span></div>
        <div class="rg-detail-row">
          <span class="rg-detail-label">{{ t('mitigacion.status') }}</span>
          <span class="rg-detail-value"><span :class="statusClass(mitigation.estado)">{{ mitigation.estado }}</span></span>
        </div>
        <div class="rg-detail-row">
          <span class="rg-detail-label">{{ t('mitigacion.result') }}</span>
          <span class="rg-detail-value"><span v-if="mitigation.resultado" :class="resultClass(mitigation.resultado)">{{ mitigation.resultado }}</span><span v-else class="rg-badge rg-badge-gray">-</span></span>
        </div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('mitigacion.observations') }}</span><span class="rg-detail-value">{{ mitigation.observaciones || '-' }}</span></div>
      </div>
      <div class="rg-card">
        <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">{{ t('evaluacionRiesgo.title') }}</div>
        <div v-if="assessment">
          <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.code') }}</span><span class="rg-detail-value">{{ assessment.codigo }}</span></div>
          <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.hazardType') }}</span><span class="rg-detail-value">{{ assessment.tipoPeligro }}</span></div>
          <div class="rg-detail-row"><span class="rg-detail-label">{{ t('evaluacionRiesgo.riskLevel') }}</span><span class="rg-detail-value">{{ assessment.nivelRiesgo }}</span></div>
          <pv-button :label="t('common.viewDetail')" icon="pi pi-external-link" size="small" text @click="router.push(`/risk-assessment/${assessment.id}`)" style="margin-top:8px" />
        </div>
        <div v-else style="color:var(--rg-text-muted);font-size:0.82rem">{{ t('common.noData') }}</div>
      </div>
    </div>
  </div>
</template>
