<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useTecnicoStore } from '@/technician/application/tecnico.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useTecnicoStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ numeroDocumento: '', nombreCompleto: '', especialidad: '', telefono: '', email: '', estado: 'Activo' })

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
        if (isEdit.value) await store.update({ ...form.value, id: route.params.id })
        else await store.add(form.value)
        toast.add({ severity: 'success', summary: t('tecnico.saveSuccess'), life: 3000 })
        router.push('/technicians')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('tecnico.editTitle') : t('tecnico.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('tecnico.document') }} *</label>
          <pv-input-text v-model="form.numeroDocumento" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('tecnico.fullName') }} *</label>
          <pv-input-text v-model="form.nombreCompleto" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('tecnico.specialty') }}</label>
          <pv-input-text v-model="form.especialidad" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('common.status') }}</label>
          <pv-select v-model="form.estado" :options="['Activo','Inactivo']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('tecnico.phone') }}</label>
          <pv-input-text v-model="form.telefono" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('tecnico.email') }}</label>
          <pv-input-text v-model="form.email" size="small" style="width:100%" />
        </div>
      </div>
    </div>
  </div>
</template>
