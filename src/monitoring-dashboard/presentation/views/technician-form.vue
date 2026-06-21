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
  firstName: '',
  lastName: '',
  code: '',
  specialty: '',
  email: '',
  phone: '',
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
  if (!isEdit.value) return t('technicians.newTechnician')
  const fullName = `${form.value.firstName} ${form.value.lastName}`.trim()
  return fullName ? t('technicians.detailTitle', { name: fullName }) : t('technicians.detail')
})
const specialtyOptions = computed(() => {
  const current = ['Electricista', 'Mecanico', 'Soldador', 'Calderas', 'Mecanica industrial']
  const existing = store.technicians.map(technician => technician.specialty)
  return [...new Set([...current, ...existing])]
})

onMounted(() => {
  const request = store.loaded ? Promise.resolve() : store.fetchDashboard()
  request.then(() => {
    if (isEdit.value) {
      const technician = store.getTechnicianById(route.params.id)
      if (!technician) {
        router.push('/monitoring/technicians')
        return
      }
      const names = technician.fullName ? technician.fullName.split(' ') : []
      form.value = {
        ...technician,
        code: technician.code || `TEC-${String(technician.id).padStart(2, '0')}`,
        firstName: technician.firstName || names.slice(0, 1).join(' '),
        lastName: technician.lastName || names.slice(1).join(' '),
        email: technician.email || '',
        phone: technician.phone || ''
      }
    }
  })
})

function saveTechnician() {
  const action = isEdit.value ? store.updateTechnician(form.value) : store.addTechnician(form.value)
  action.then(() => router.push('/monitoring/technicians'))
}
</script>

<template>
  <div class="content">
    <div class="status-banner mb-4">
      <i class="pi pi-check-circle mr-2"></i>{{ t('dashboard.status') }}
    </div>

    <section class="panel p-4 technician-form-panel">
      <h1>{{ pageTitle }}</h1>
      <form class="technician-form" @submit.prevent="saveTechnician">
        <label>{{ t('technicians.firstName') }}</label>
        <pv-input-text v-model="form.firstName" class="w-full" required />

        <label>{{ t('technicians.lastName') }}</label>
        <pv-input-text v-model="form.lastName" class="w-full" required />

        <template v-if="isEdit">
          <label>{{ t('technicians.code') }}</label>
          <pv-input-text v-model="form.code" class="w-full" disabled />
        </template>

        <label>{{ t('technicians.specialty') }}</label>
        <pv-select v-model="form.specialty" :options="specialtyOptions" class="w-full" required />

        <label>{{ t('technicians.email') }}</label>
        <pv-input-text v-model="form.email" class="w-full" type="email" required />

        <label>{{ t('technicians.phone') }}</label>
        <pv-input-text v-model="form.phone" class="w-full" required />

        <template v-if="isEdit">
          <label>{{ t('tickets.status') }}</label>
          <div class="switch-line">
            <span>{{ form.status }}</span>
            <pv-toggle-switch v-model="active" />
          </div>
        </template>

        <div class="form-actions">
          <pv-button :label="t('tickets.cancel')" class="orange-button" @click="router.push('/monitoring/technicians')" />
          <pv-button :label="isEdit ? t('assets.saveChanges') : t('tickets.accept')" class="orange-button" type="submit" />
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.technician-form-panel {
  max-width: 1040px;
  margin: 0 auto;
}

.technician-form-panel h1 {
  color: #ff5b00;
  font-size: 0.92rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.technician-form {
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
