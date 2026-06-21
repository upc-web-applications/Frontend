<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useHazardStore } from '@/hazard/application/hazard.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useHazardStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ codigo:'', nombre:'', tipo:'Físico', descripcion:'', nivelRiesgoBase:'Medio', estado:'Activo' })

const tipoOptions = ['Físico', 'Químico', 'Ergonómico', 'Biológico', 'Mecánico', 'Eléctrico', 'Psicosocial', 'Otro']
const nivelOptions = ['Bajo', 'Medio', 'Alto', 'Crítico']

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
        toast.add({ severity: 'success', summary: t('peligro.saveSuccess'), life: 3000 })
        router.push('/hazard/list')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('peligro.editTitle') : t('peligro.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('peligro.code') }} *</label>
          <pv-input-text v-model="form.codigo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('peligro.status') }}</label>
          <pv-select v-model="form.estado" :options="['Activo','Inactivo']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('peligro.name') }} *</label>
          <pv-input-text v-model="form.nombre" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('peligro.type') }} *</label>
          <pv-select v-model="form.tipo" :options="tipoOptions" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('peligro.baseRisk') }}</label>
          <pv-select v-model="form.nivelRiesgoBase" :options="nivelOptions" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('peligro.description') }}</label>
          <pv-textarea v-model="form.descripcion" size="small" style="width:100%" rows="3" />
        </div>
      </div>
    </div>
  </div>
</template>
