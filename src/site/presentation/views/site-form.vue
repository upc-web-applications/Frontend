<script setup>
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useSiteStore } from '@/site/application/site.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useSiteStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ nombre:'', direccion:'', telefono:'', email:'', estado:'Activo', fechaCreacion: new Date().toISOString().split('T')[0] })

onMounted(() => {
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
        toast.add({ severity: 'success', summary: t('sede.saveSuccess'), life: 3000 })
        router.push('/site/list')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('sede.editTitle') : t('sede.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('sede.name') }} *</label>
          <pv-input-text v-model="form.nombre" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('sede.status') }}</label>
          <pv-select v-model="form.estado" :options="['Activo','Inactivo']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('sede.address') }} *</label>
          <pv-input-text v-model="form.direccion" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('sede.phone') }}</label>
          <pv-input-text v-model="form.telefono" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('sede.email') }}</label>
          <pv-input-text v-model="form.email" size="small" style="width:100%" />
        </div>
      </div>
    </div>
  </div>
</template>
