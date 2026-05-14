<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useMitigationStore } from '@/mitigation/application/mitigation.store.js'
import { useRiskAssessmentStore } from '@/risk-assessment/application/risk-assessment.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useMitigationStore()
const assessmentStore = useRiskAssessmentStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ riskAssessmentId: route.query.assessmentId || null, codigo:'', descripcion:'', responsable:'', fechaAsignacion: new Date().toISOString().split('T')[0], fechaEjecucion:'', estado:'Pendiente', resultado:'', observaciones:'' })

onMounted(() => {
    if (!assessmentStore.loaded) assessmentStore.fetchAll()
    if (isEdit.value) {
        if (!store.loaded) store.fetchAll()
        const e = store.getById(route.params.id)
        if (e) Object.assign(form.value, e)
    }
})

const submit = async () => {
    saving.value = true
    try {
        if (isEdit.value) await store.update({ ...form.value, id: parseInt(route.params.id) })
        else await store.add(form.value)
        toast.add({ severity: 'success', summary: t('mitigacion.saveSuccess'), life: 3000 })
        router.push('/mitigation/list')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('mitigacion.editTitle') : t('mitigacion.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.code') }} *</label>
          <pv-input-text v-model="form.codigo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.status') }}</label>
          <pv-select v-model="form.estado" :options="['Pendiente','En Progreso','Implementado','Verificado','Cerrado']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.assessment') }}</label>
          <pv-select v-model="form.riskAssessmentId" :options="assessmentStore.assessments" option-label="codigo" option-value="id" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.responsable') }} *</label>
          <pv-input-text v-model="form.responsable" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('mitigacion.description') }} *</label>
          <pv-textarea v-model="form.descripcion" size="small" style="width:100%" rows="3" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.assignedDate') }}</label>
          <pv-input-text v-model="form.fechaAsignacion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.executionDate') }}</label>
          <pv-input-text v-model="form.fechaEjecucion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.result') }}</label>
          <pv-select v-model="form.resultado" :options="['','Aprobado','Rechazado']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('mitigacion.observations') }}</label>
          <pv-textarea v-model="form.observaciones" size="small" style="width:100%" rows="2" />
        </div>
      </div>
    </div>
  </div>
</template>
