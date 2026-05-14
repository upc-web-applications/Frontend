<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useActivoStore } from '@/activo/application/activo.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSedeStore } from '@/sede/application/sede.store.js'

const { t } = useI18n()
const route = useRoute(); const router = useRouter(); const toast = useToast()
const store = useActivoStore(); const areaStore = useAreaStore(); const sedeStore = useSedeStore()
const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ codigo:'', nombre:'', descripcion:'', tipo:'Maquinaria', areaId:null, sedeId:null, estado:'Activo', fechaAdquisicion:'', ultimoMantenimiento:'' })

const sedeOptions = computed(() => sedeStore.sedes.filter(s => s.estado === 'Activo').map(s => ({ label: s.nombre, value: s.id })))
const areaOptions = computed(() => areaStore.areas.filter(a => a.sedeId === form.value.sedeId && a.estado === 'Activo').map(a => ({ label: a.nombre, value: a.id })))

watch(() => form.value.sedeId, () => { form.value.areaId = null })

onMounted(() => {
    if (!sedeStore.loaded) sedeStore.fetchAll()
    if (!areaStore.loaded) areaStore.fetchAll()
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
        toast.add({ severity: 'success', summary: t('activo.saveSuccess'), life: 3000 })
        router.push('/activo/list')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('activo.editTitle') : t('activo.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.code') }} *</label>
          <pv-input-text v-model="form.codigo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.name') }} *</label>
          <pv-input-text v-model="form.nombre" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.type') }}</label>
          <pv-select v-model="form.tipo" :options="['Maquinaria','Equipo','Infraestructura','Vehículo']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.status') }}</label>
          <pv-select v-model="form.estado" :options="['Activo','Inactivo']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.sede') }} *</label>
          <pv-select v-model="form.sedeId" :options="sedeOptions" option-label="label" option-value="value" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.area') }} *</label>
          <pv-select v-model="form.areaId" :options="areaOptions" option-label="label" option-value="value" :disabled="!form.sedeId" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.acquisitionDate') }}</label>
          <pv-input-text v-model="form.fechaAdquisicion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('activo.lastMaintenance') }}</label>
          <pv-input-text v-model="form.ultimoMantenimiento" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('activo.description') }}</label>
          <pv-textarea v-model="form.descripcion" rows="3" style="width:100%;resize:none" />
        </div>
      </div>
    </div>
  </div>
</template>
