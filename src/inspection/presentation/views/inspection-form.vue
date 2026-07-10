<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useInspectionStore } from '@/inspection/application/inspection.store.js'
import { useAreaStore } from '@/organization-assets/area/application/area.store.js'
import { useAssetStore } from '@/organization-assets/asset/application/asset.store.js'
import { useSiteStore } from '@/organization-assets/site/application/site.store.js'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const store = useInspectionStore()
const areaStore = useAreaStore()
const assetStore = useAssetStore()
const siteStore = useSiteStore()
const identityStore = useIdentityAccessStore()

const saving = ref(false)
const photoPreview = ref(null)
const photoError = ref('')
const fileInput = ref(null)
const otherIncidentType = ref('')

const form = ref({
  tipoIncidente: '',
  sedeId: null,
  areaId: null,
  activoId: null,
  nivelUrgencia: '',
  descripcion: '',
  estado: 'Recibido',
  fotoUrl: null,
  operarioId: null,
  ticket: '',
  fechaReporte: '',
  fechaActualizacion: '',
  accionCorrectiva: null
})

const incidentTypes = ['Condicion insegura', 'Casi-accidente', 'Falla de equipo', 'Riesgo ergonomico', 'Riesgo quimico', 'Otro']
const urgencies = [
  { label: 'Bajo', value: 'Bajo', color: 'var(--rg-green)' },
  { label: 'Medio', value: 'Medio', color: 'var(--rg-amber)' },
  { label: 'Alto', value: 'Alto', color: 'var(--rg-red)' }
]

const siteOptions = computed(() => siteStore.sites.filter(site => site.estado === 'Activo').map(site => ({ label: site.nombre, value: site.id })))
const areaOptions = computed(() => areaStore.areas.filter(area => area.sedeId === form.value.sedeId && area.estado === 'Activo').map(area => ({ label: area.nombre, value: area.id })))
const assetOptions = computed(() => assetStore.assets.filter(asset => asset.areaId === form.value.areaId && asset.estado === 'Activo').map(asset => ({ label: `${asset.codigo} - ${asset.nombre}`, value: asset.id })))
const charCount = computed(() => form.value.descripcion.length)
const isTypeAndSectorComplete = computed(() => Boolean(
  form.value.tipoIncidente &&
  (form.value.tipoIncidente !== 'Otro' || otherIncidentType.value.trim()) &&
  form.value.sedeId &&
  form.value.areaId &&
  form.value.activoId
))
const isUrgencyComplete = computed(() => Boolean(form.value.nivelUrgencia))
const isDescriptionComplete = computed(() => Boolean(form.value.descripcion.trim()))
const isReadyToSubmit = computed(() => isTypeAndSectorComplete.value && isUrgencyComplete.value && isDescriptionComplete.value)
const progressSteps = computed(() => [
  { label: t('inspeccion.typeAndSector'), completed: isTypeAndSectorComplete.value },
  { label: t('inspeccion.stepUrgency'), completed: isUrgencyComplete.value },
  { label: t('inspeccion.stepDescription'), completed: isDescriptionComplete.value },
  { label: t('inspeccion.stepSubmit'), completed: isReadyToSubmit.value }
])
const urgencyImpact = computed(() => deriveUrgencyImpact(form.value.nivelUrgencia))

watch(() => form.value.sedeId, () => {
  form.value.areaId = null
  form.value.activoId = null
})
watch(() => form.value.areaId, () => {
  form.value.activoId = null
})

onMounted(() => {
  if (!siteStore.loaded) siteStore.fetchAll()
  if (!areaStore.loaded) areaStore.fetchAll()
  if (!assetStore.loaded) assetStore.fetchAll()
})

function deriveUrgencyImpact(urgency) {
  return {
    Alto: { prioridadAtencion: 'Alta', slaSugeridoHoras: 8, entradaEvaluacionRiesgo: 'Urgencia alta: priorizar evaluacion IPERC y atencion inmediata.' },
    Medio: { prioridadAtencion: 'Media', slaSugeridoHoras: 24, entradaEvaluacionRiesgo: 'Urgencia media: evaluar riesgo dentro del ciclo operativo.' },
    Bajo: { prioridadAtencion: 'Baja', slaSugeridoHoras: 72, entradaEvaluacionRiesgo: 'Urgencia baja: programar evaluacion sin afectar operacion critica.' }
  }[urgency] ?? { prioridadAtencion: '-', slaSugeridoHoras: null, entradaEvaluacionRiesgo: '-' }
}

function triggerFile() {
  fileInput.value?.click()
}

function removePhoto() {
  photoPreview.value = null
  form.value.fotoUrl = null
  if (fileInput.value) fileInput.value.value = ''
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    photoError.value = t('inspeccion.invalidPhotoType')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    photoError.value = t('inspeccion.photoTooLarge')
    return
  }
  photoError.value = ''
  const reader = new FileReader()
  reader.onload = () => {
    photoPreview.value = reader.result
    form.value.fotoUrl = reader.result
  }
  reader.readAsDataURL(file)
}

async function submit() {
  if (!isReadyToSubmit.value) {
    toast.add({ severity: 'warn', summary: t('inspeccion.requiredWarning'), life: 4000 })
    return
  }

  saving.value = true
  try {
    const now = new Date().toISOString()
    const ticketNum = Math.floor(4800 + Math.random() * 200)
    const impact = deriveUrgencyImpact(form.value.nivelUrgencia)
    const result = await store.add({
      ...form.value,
      ...impact,
      tipoIncidente: form.value.tipoIncidente === 'Otro' ? otherIncidentType.value.trim() : form.value.tipoIncidente,
      operarioId: identityStore.currentUser?.id,
      ticket: `TICK-${ticketNum}`,
      estado: 'Recibido',
      fechaReporte: now,
      fechaActualizacion: now
    })
    toast.add({ severity: 'success', summary: t('inspeccion.createdSuccess'), detail: `TICK-${ticketNum}`, life: 5000 })
    router.push(`/inspection/${result.id}`)
  } catch {
    toast.add({ severity: 'error', summary: t('inspeccion.sendError'), life: 4000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('inspeccion.newTitle') }}</span>
      </div>
      <pv-button :label="t('inspeccion.sendReport')" icon="pi pi-send" size="small" :loading="saving" @click="submit" />
    </div>

    <div class="inspection-progress">
      <div
        v-for="(step, index) in progressSteps"
        :key="step.label"
        class="inspection-progress-step"
        :class="{ completed: step.completed }"
      >
        <span class="inspection-progress-index">{{ index + 1 }}</span>
        {{ step.label }}
      </div>
    </div>

    <div class="inspection-form-grid">
      <div class="rg-card" style="display:flex;flex-direction:column;gap:12px">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.type') }} *</label>
          <pv-select v-model="form.tipoIncidente" :options="incidentTypes" size="small" style="width:100%" />
        </div>
        <div v-if="form.tipoIncidente === 'Otro'" class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.otherType') }} *</label>
          <pv-input-text v-model="otherIncidentType" maxlength="80" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.sede') }} *</label>
          <pv-select v-model="form.sedeId" :options="siteOptions" option-label="label" option-value="value" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.area') }} *</label>
          <pv-select v-model="form.areaId" :options="areaOptions" option-label="label" option-value="value" :disabled="!form.sedeId" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.asset') }} *</label>
          <pv-select v-model="form.activoId" :options="assetOptions" option-label="label" option-value="value" :disabled="!form.areaId" size="small" style="width:100%" />
        </div>
      </div>

      <div class="rg-card" style="display:flex;flex-direction:column;gap:12px">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.urgency') }} *</label>
          <div class="urgency-grid">
            <button
              v-for="urgency in urgencies"
              :key="urgency.value"
              type="button"
              class="urgency-option"
              :class="{ selected: form.nivelUrgencia === urgency.value }"
              :style="{ '--urgency-color': urgency.color }"
              @click="form.nivelUrgencia = urgency.value"
            >
              {{ urgency.label }}
            </button>
          </div>
        </div>

        <div v-if="form.nivelUrgencia" class="urgency-impact">
          <div><span>{{ t('inspeccion.priority') }}</span><strong>{{ urgencyImpact.prioridadAtencion }}</strong></div>
          <div><span>{{ t('inspeccion.suggestedSla') }}</span><strong>{{ urgencyImpact.slaSugeridoHoras }}h</strong></div>
          <div><span>{{ t('inspeccion.riskInput') }}</span><strong>{{ urgencyImpact.entradaEvaluacionRiesgo }}</strong></div>
        </div>

        <div class="rg-form-field">
          <label class="rg-label">
            {{ t('inspeccion.description') }} *
            <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--rg-text-muted)">({{ charCount }}/300)</span>
          </label>
          <pv-textarea v-model="form.descripcion" rows="5" maxlength="300" style="width:100%;resize:none" />
        </div>
      </div>
    </div>

    <div class="rg-card" style="margin-top:12px">
      <label class="rg-label" style="display:block;margin-bottom:8px">{{ t('inspeccion.photoEvidence') }}</label>
      <div v-if="!photoPreview" class="photo-dropzone" @click="triggerFile">
        <i class="pi pi-camera" />
        <span>{{ t('inspeccion.attachPhoto') }}</span>
      </div>
      <div v-else style="position:relative;display:inline-block">
        <img :src="photoPreview" style="height:120px;border-radius:8px;border:1px solid var(--rg-border)" alt="Inspection evidence" />
        <button type="button" class="photo-remove" @click="removePhoto">
          <i class="pi pi-times" />
        </button>
      </div>
      <small v-if="photoError" style="color:var(--rg-red)">{{ photoError }}</small>
      <input ref="fileInput" type="file" accept="image/jpeg,image/png" style="display:none" @change="onFileChange" />
    </div>

    <div style="display:flex;gap:12px;margin-top:12px">
      <pv-button :label="t('common.cancel')" severity="secondary" size="small" style="flex:0.3" @click="router.back()" />
      <pv-button :label="t('inspeccion.sendReport')" icon="pi pi-send" size="small" style="flex:0.7" :disabled="!isReadyToSubmit" :loading="saving" @click="submit" />
    </div>
  </div>
</template>

<style scoped>
.inspection-progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  margin-bottom: 12px;
  overflow: hidden;
  border: 1px solid var(--rg-border);
  border-radius: 8px;
  background: var(--rg-border);
}

.inspection-progress-step {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 8px 12px;
  background: var(--rg-bg-2);
  color: var(--rg-text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.inspection-progress-step.completed {
  background: var(--rg-primary);
  color: #ffffff;
}

.inspection-progress-index {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.68rem;
}

.inspection-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.urgency-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.urgency-option {
  height: 40px;
  border: 1px solid var(--urgency-color);
  border-radius: 6px;
  background: transparent;
  color: var(--urgency-color);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 800;
}

.urgency-option.selected {
  background: var(--urgency-color);
  color: #ffffff;
}

.urgency-impact {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--rg-border);
  border-radius: 8px;
  background: var(--rg-bg-2);
}

.urgency-impact div {
  display: grid;
  gap: 3px;
}

.urgency-impact span {
  color: var(--rg-text-muted);
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.urgency-impact strong {
  color: var(--rg-text);
  font-size: 0.82rem;
}

.photo-dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 80px;
  border: 2px dashed var(--rg-border);
  border-radius: 8px;
  color: var(--rg-text-muted);
  cursor: pointer;
  font-size: 0.82rem;
}

.photo-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  background: var(--rg-red);
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
}

@media (max-width: 760px) {
  .inspection-form-grid,
  .inspection-progress {
    grid-template-columns: 1fr;
  }
}
</style>
