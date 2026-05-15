<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const store = useMonitoringStore()

const form = ref({
  name: '',
  code: '',
  description: '',
  status: 'Activo'
})

const isEdit = computed(() => !!route.params.id)
const active = computed({
  get: () => form.value.status !== 'Inactivo',
  set: value => {
    form.value.status = value ? 'Activo' : 'Inactivo'
  }
})
const pageTitle = computed(() => {
  if (!isEdit.value) return t('sectors.newSector')
  return form.value.name ? t('sectors.detailTitle', { name: form.value.name }) : t('sectors.detail')
})

onMounted(() => {
  const request = store.loaded ? Promise.resolve() : store.fetchDashboard()
  request.then(() => {
    if (isEdit.value) {
      const sector = store.getSectorById(route.params.id)
      if (!sector) {
        router.push('/monitoring/sectors')
        return
      }
      form.value = {
        ...sector,
        code: sector.code || `SEC-${String(sector.id).padStart(3, '0')}`,
        description: sector.description || ''
      }
    }
  })
})

function saveSector() {
  const action = isEdit.value ? store.updateSector(form.value) : store.addSector(form.value)
  action.then(() => router.push('/monitoring/sectors'))
}
</script>

<template>
  <div class="content">
    <div class="status-banner mb-4">
      <i class="pi pi-check-circle mr-2"></i>{{ t('dashboard.status') }}
    </div>

    <section class="panel p-4 sector-form-panel">
      <h1>{{ pageTitle }}</h1>
      <form class="sector-form" @submit.prevent="saveSector">
        <label>{{ t('sectors.name') }}</label>
        <pv-input-text v-model="form.name" class="w-full" :placeholder="t('sectors.namePlaceholder')" required />

        <template v-if="isEdit">
          <label>{{ t('sectors.code') }}</label>
          <pv-input-text v-model="form.code" class="w-full" disabled />
        </template>

        <label>{{ t('sectors.description') }}</label>
        <pv-input-text v-model="form.description" class="w-full" :placeholder="t('sectors.descriptionPlaceholder')" maxlength="5000" />

        <template v-if="isEdit">
          <label>{{ t('tickets.status') }}</label>
          <div class="switch-line">
            <span>{{ form.status }}</span>
            <pv-toggle-switch v-model="active" />
          </div>
        </template>

        <div class="form-actions">
          <pv-button :label="t('tickets.cancel')" class="orange-button" @click="router.push('/monitoring/sectors')" />
          <pv-button :label="isEdit ? t('assets.saveChanges') : t('tickets.accept')" class="orange-button" type="submit" />
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.sector-form-panel {
  max-width: 1100px;
  margin: 0 auto;
}

.sector-form-panel h1 {
  color: #ff5b00;
  font-size: 0.92rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.sector-form {
  display: grid;
  gap: 0.65rem;
}

label {
  color: #e4e9f2;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
}

.switch-line {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #070d17;
  border: 1px solid #263142;
  border-radius: 6px;
  color: #aab4c4;
  padding: 0.6rem 0.8rem;
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-top: 1.5rem;
}

@media (max-width: 780px) {
  .form-actions {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
