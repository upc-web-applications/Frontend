<script setup>
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSiteStore } from '@/site/application/site.store.js'

const { t } = useI18n()
const route = useRoute(); const router = useRouter(); const toast = useToast()
const store = useAreaStore(); const siteStore = useSiteStore()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ nombre:'', codigo:'', descripcion:'', sedeId:null, estado:'Activo', nivelRiesgo:'Medio', fechaCreacion: new Date().toISOString().split('T')[0] })
const siteOptions = computed(() => siteStore.sites.filter(s => s.estado==='Activo').map(s => ({ label: s.nombre, value: s.id })))

onMounted(() => {
    if (!siteStore.loaded) siteStore.fetchAll()
    if (isEdit.value) { if (!store.loaded) store.fetchAll(); const e = store.getById(route.params.id); if (e) Object.assign(form.value, e) }
})

const submit = async () => {
    saving.value = true
    try {
        if (isEdit.value) await store.update({ ...form.value, id: parseInt(route.params.id) })
        else await store.add(form.value)
        toast.add({ severity: 'success', summary: t('area.saveSuccess'), life: 3000 })
        router.push('/area/list')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('area.editTitle') : t('area.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('area.name') }} *</label>
          <pv-input-text v-model="form.nombre" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('area.code') }} *</label>
          <pv-input-text v-model="form.codigo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('area.sede') }} *</label>
          <pv-select v-model="form.sedeId" :options="siteOptions" option-label="label" option-value="value" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('area.riskLevel') }}</label>
          <pv-select v-model="form.nivelRiesgo" :options="['Bajo','Medio','Alto','Crítico']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('area.status') }}</label>
          <pv-select v-model="form.estado" :options="['Activo','Inactivo']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('area.description') }}</label>
          <pv-textarea v-model="form.descripcion" rows="3" style="width:100%;resize:none" />
        </div>
      </div>
    </div>
  </div>
</template>
