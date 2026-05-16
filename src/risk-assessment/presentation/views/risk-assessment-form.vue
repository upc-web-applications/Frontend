<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useRiskAssessmentStore } from '@/risk-assessment/application/risk-assessment.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useRiskAssessmentStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ codigo:'', sector:'', tipoPeligro:'', descripcion:'', probabilidad:1, severidad:1, nivelRiesgo:'Bajo', medidasControl:'', estado:'Pendiente', fechaEvaluacion: new Date().toISOString().split('T')[0], usuarioId:null })

const peligroOptions = ['Físico', 'Químico', 'Ergonómico', 'Biológico', 'Mecánico', 'Eléctrico', 'Psicosocial', 'Otro']

const matrizIPERC = {
    1:{1:'Bajo',2:'Bajo',3:'Medio',4:'Alto',5:'Alto'},
    2:{1:'Bajo',2:'Medio',3:'Medio',4:'Alto',5:'Crítico'},
    3:{1:'Medio',2:'Medio',3:'Alto',4:'Alto',5:'Crítico'},
    4:{1:'Medio',2:'Alto',3:'Alto',4:'Crítico',5:'Crítico'},
    5:{1:'Alto',2:'Alto',3:'Crítico',4:'Crítico',5:'Crítico'}
}

function calcularNivelRiesgo() {
    const p = parseInt(form.value.probabilidad) || 1
    const s = parseInt(form.value.severidad) || 1
    form.value.nivelRiesgo = matrizIPERC[p]?.[s] ?? 'Bajo'
}

watch(() => form.value.probabilidad, calcularNivelRiesgo)
watch(() => form.value.severidad, calcularNivelRiesgo)

onMounted(async () => {
    if (isEdit.value) {
        if (!store.loaded) await store.fetchAll()
        const e = store.getById(route.params.id)
        if (e) Object.assign(form.value, { ...e })
    }
})

const submit = async () => {
    saving.value = true
    try {
        if (isEdit.value) await store.update({ ...form.value, id: parseInt(route.params.id) })
        else await store.add(form.value)
        toast.add({ severity: 'success', summary: t('evaluacionRiesgo.saveSuccess'), life: 3000 })
        router.push('/risk-assessment/list')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('evaluacionRiesgo.editTitle') : t('evaluacionRiesgo.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.code') }} *</label>
          <pv-input-text v-model="form.codigo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.status') }}</label>
          <pv-select v-model="form.estado" :options="['Pendiente','En Evaluación','Evaluado','Cerrado']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.sector') }} *</label>
          <pv-input-text v-model="form.sector" size="small" style="width:100%" placeholder="Ej: Almacén, Producción, Taller" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.hazardType') }} *</label>
          <pv-select v-model="form.tipoPeligro" :options="peligroOptions" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('evaluacionRiesgo.description') }} *</label>
          <pv-textarea v-model="form.descripcion" size="small" style="width:100%" rows="3" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.probability') }} (1-5)</label>
          <pv-input-number v-model="form.probabilidad" :min="1" :max="5" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.severity') }} (1-5)</label>
          <pv-input-number v-model="form.severidad" :min="1" :max="5" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.riskLevel') }}</label>
          <pv-input-text :value="form.nivelRiesgo" size="small" disabled style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('evaluacionRiesgo.date') }}</label>
          <pv-input-text v-model="form.fechaEvaluacion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('evaluacionRiesgo.controlMeasures') }}</label>
          <pv-textarea v-model="form.medidasControl" size="small" style="width:100%" rows="3" />
        </div>
      </div>
    </div>
  </div>
</template>
