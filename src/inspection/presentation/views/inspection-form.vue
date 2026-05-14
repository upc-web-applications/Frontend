<script setup>
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useInspectionStore } from '@/inspection/application/inspection.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useAssetStore } from '@/asset/application/asset.store.js'
import { useSiteStore } from '@/site/application/site.store.js'

const { t } = useI18n(); const router = useRouter(); const toast = useToast()
const store = useInspectionStore(); const areaStore = useAreaStore()
const assetStore = useAssetStore(); const siteStore = useSiteStore()

const saving = ref(false)
const charCount = ref(0)
const photoPreview = ref(null)
const photoError = ref('')
const fileInput = ref(null)

const form = ref({ tipoIncidente:'', sedeId:null, areaId:null, activoId:null, nivelUrgencia:'', descripcion:'', estado:'Pendiente', fotoUrl:null, operarioId:1, ticket:'', fechaReporte:'', fechaActualizacion:'', accionCorrectiva:null })

const tiposIncidente = ['Condición insegura','Casi-accidente','Falla de equipo','Riesgo ergonómico','Riesgo químico','Otro']
const urgencias = [
    { label: 'Bajo',  value: 'Bajo',  color: '#22C55E' },
    { label: 'Medio', value: 'Medio', color: '#f59e0b' },
    { label: 'Alto',  value: 'Alto',  color: '#E24B4A' }
]

const siteOptions   = computed(() => siteStore.sites.filter(s => s.estado === 'Activo').map(s => ({ label: s.nombre, value: s.id })))
const areaOptions   = computed(() => areaStore.areas.filter(a => a.sedeId === form.value.sedeId && a.estado === 'Activo').map(a => ({ label: a.nombre, value: a.id })))
const assetOptions = computed(() => assetStore.assets.filter(a => a.areaId === form.value.areaId && a.estado === 'Activo').map(a => ({ label: `${a.codigo} — ${a.nombre}`, value: a.id })))

watch(() => form.value.sedeId, () => { form.value.areaId = null; form.value.activoId = null })
watch(() => form.value.areaId, () => { form.value.activoId = null })

onMounted(() => {
    if (!siteStore.loaded) siteStore.fetchAll()
    if (!areaStore.loaded) areaStore.fetchAll()
    if (!assetStore.loaded) assetStore.fetchAll()
})

const triggerFile = () => fileInput.value?.click()
const removePhoto = () => { photoPreview.value = null; form.value.fotoUrl = null; if (fileInput.value) fileInput.value.value = '' }
const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { photoError.value = 'La imagen supera el tamaño permitido. Máximo 5 MB'; return }
    photoError.value = ''
    const reader = new FileReader()
    reader.onload = () => { photoPreview.value = reader.result; form.value.fotoUrl = reader.result }
    reader.readAsDataURL(file)
}

const currentStep = ref(0)
const steps = ['Tipo y Sector', 'Urgencia', 'Descripción', 'Envío']

const submit = async () => {
    saving.value = true; currentStep.value = 3
    try {
        const now = new Date().toISOString()
        const ticketNum = Math.floor(4800 + Math.random() * 200)
        const result = await store.add({ ...form.value, ticket: `TICK-${ticketNum}`, fechaReporte: now, fechaActualizacion: now })
        toast.add({ severity: 'success', summary: `Reporte enviado — Ticket: TICK-${ticketNum}`, life: 5000 })
        router.push(`/inspection/${result.id}`)
    } catch {
        toast.add({ severity: 'error', summary: 'Error al enviar. Verifique su conexión.', life: 4000 })
    } finally { saving.value = false }
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

    <!-- Progress bar -->
    <div style="display:flex;margin-bottom:12px;background:var(--rg-bg-2);border:1px solid var(--rg-border);border-radius:8px;overflow:hidden">
      <div v-for="(step, i) in steps" :key="i"
        style="flex:1;padding:8px 12px;font-size:0.72rem;font-weight:600;text-align:center;letter-spacing:0.04em;transition:all 0.2s"
        :style="{ background: i < currentStep ? 'var(--rg-primary)' : i === currentStep ? 'var(--rg-primary-dim)' : 'transparent', color: i <= currentStep ? 'white' : 'var(--rg-text-muted)', borderRight: i < 3 ? '1px solid var(--rg-border)' : 'none' }">
        {{ step }}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <!-- LEFT -->
      <div class="rg-card" style="display:flex;flex-direction:column;gap:12px">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.type') }} *</label>
          <pv-select v-model="form.tipoIncidente" :options="tiposIncidente" size="small" style="width:100%" />
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
          <label class="rg-label">{{ t('inspeccion.asset') }}</label>
          <pv-select v-model="form.activoId" :options="assetOptions" option-label="label" option-value="value" :disabled="!form.areaId" show-clear size="small" style="width:100%" />
        </div>
      </div>

      <!-- RIGHT -->
      <div class="rg-card" style="display:flex;flex-direction:column;gap:12px">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.urgency') }} *</label>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
            <button v-for="u in urgencias" :key="u.value" type="button"
              style="height:40px;border-radius:6px;border:1px solid;font-size:0.78rem;font-weight:700;cursor:pointer;transition:all 0.15s;letter-spacing:0.04em"
              :style="{ background: form.nivelUrgencia === u.value ? u.color : 'transparent', borderColor: u.color, color: form.nivelUrgencia === u.value ? 'white' : u.color }"
              @click="form.nivelUrgencia = u.value">{{ u.label }}</button>
          </div>
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('inspeccion.description') }} * <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--rg-text-muted)">({{ charCount }}/300)</span></label>
          <pv-textarea v-model="form.descripcion" rows="5" maxlength="300" style="width:100%;resize:none" @input="charCount = form.descripcion.length" />
        </div>
      </div>
    </div>

    <!-- Photo upload -->
    <div class="rg-card" style="margin-top:12px">
      <label class="rg-label" style="display:block;margin-bottom:8px">Evidencia fotográfica</label>
      <div v-if="!photoPreview"
        style="border:2px dashed var(--rg-border);border-radius:8px;height:80px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer"
        @click="triggerFile">
        <i class="pi pi-camera" style="color:var(--rg-text-muted);font-size:18px" />
        <span style="color:var(--rg-text-muted);font-size:0.82rem">Adjuntar foto (JPG/PNG, máx. 5MB)</span>
      </div>
      <div v-else style="position:relative;display:inline-block">
        <img :src="photoPreview" style="height:120px;border-radius:8px;border:1px solid var(--rg-border)" />
        <button type="button" style="position:absolute;top:4px;right:4px;background:var(--rg-red);border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;color:white;font-size:12px;display:flex;align-items:center;justify-content:center" @click="removePhoto">
          <i class="pi pi-times" />
        </button>
      </div>
      <small v-if="photoError" style="color:var(--rg-red)">{{ photoError }}</small>
      <input ref="fileInput" type="file" accept="image/jpeg,image/png" style="display:none" @change="onFileChange" />
    </div>

    <!-- Actions -->
    <div style="display:flex;gap:12px;margin-top:12px">
      <pv-button :label="t('common.cancel')" severity="secondary" size="small" style="flex:0.3" @click="router.back()" />
      <pv-button :label="t('inspeccion.sendReport')" icon="pi pi-send" size="small" style="flex:0.7" :loading="saving" @click="submit" />
    </div>
  </div>
</template>
