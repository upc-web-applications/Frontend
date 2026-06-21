<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const store = useMonitoringStore()

const selectedTechnician = ref(null)
const selectedSpecialty = ref(null)
const assignmentDetails = ref('')
const validationMessage = ref('')

const ticket = computed(() => store.getTicketById(route.params.id))
const isAssignMode = computed(() => route.name === 'monitoring-ticket-assign')

const specialtyOptions = computed(() => {
  const specialties = store.activeTechnicians.map(technician => technician.specialty)
  return [...new Set(specialties)]
})

const filteredTechnicians = computed(() => {
  if (!selectedSpecialty.value) return store.activeTechnicians
  return store.activeTechnicians.filter(technician => technician.specialty === selectedSpecialty.value)
})

onMounted(() => {
  const request = store.loaded ? Promise.resolve() : store.fetchDashboard()
  request.then(() => {
    if (!ticket.value) {
      router.push('/monitoring/tickets')
      return
    }
    selectedTechnician.value = ticket.value.assignedTechnician || null
    selectedSpecialty.value = ticket.value.requiredSpecialty || getTechnicianSpecialty(ticket.value.assignedTechnician)
    assignmentDetails.value = ticket.value.assignmentDetails || ''
  })
})

function getTechnicianSpecialty(technicianName) {
  const technician = store.technicians.find(item => item.fullName === technicianName)
  return technician ? technician.specialty : null
}

function selectSpecialty() {
  const technician = store.technicians.find(item => item.fullName === selectedTechnician.value)
  if (technician && technician.specialty !== selectedSpecialty.value) {
    selectedTechnician.value = null
  }
}

function saveAssignment() {
  validationMessage.value = ''
  if (!selectedTechnician.value) {
    validationMessage.value = t('tickets.requiredSpecificTechnician')
    return
  }
  store.assignTechnician(ticket.value, selectedTechnician.value, assignmentDetails.value, selectedSpecialty.value).then(() => {
    router.push('/monitoring/tickets')
  })
}

function navigateBack() {
  router.push('/monitoring/tickets')
}
</script>

<template>
  <div class="content">
    <section v-if="ticket" class="assignment-panel panel p-4">
      <h1>{{ isAssignMode ? t('tickets.assignmentTitle') : t('tickets.assignmentDetailTitle') }}</h1>
      <div class="assignment-form">
        <label>{{ t('tickets.assignmentCode') }}</label>
        <pv-input-text :model-value="ticket.code" disabled class="w-full" />

        <label>{{ t('tickets.asset') }}</label>
        <pv-input-text :model-value="ticket.assetName || ticket.sector" disabled class="w-full" />

        <label>{{ t('tickets.risk') }}</label>
        <pv-input-text :model-value="ticket.riskLevel" disabled class="w-full" />

        <label>{{ t('tickets.specialty') }}</label>
        <pv-select v-model="selectedSpecialty" :options="specialtyOptions" class="w-full" :placeholder="t('tickets.specialty')" @change="selectSpecialty" />

        <label>{{ t('tickets.technicianName') }}</label>
        <pv-select v-model="selectedTechnician" :options="filteredTechnicians" option-label="fullName" option-value="fullName" class="w-full" :placeholder="t('tickets.technician')" />

        <label>{{ t('tickets.details') }}</label>
        <pv-input-text v-model="assignmentDetails" class="w-full" :placeholder="t('tickets.detailsPlaceholder')" />

        <p v-if="validationMessage" class="validation">*{{ validationMessage }}</p>

        <div class="assignment-actions">
          <pv-button :label="t('tickets.cancel')" class="orange-button" @click="navigateBack" />
          <pv-button :label="t('tickets.accept')" class="orange-button" @click="saveAssignment" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.assignment-panel {
  max-width: 1040px;
  margin: 0 auto;
}

.assignment-panel h1 {
  color: #ff5b00;
  font-size: 0.95rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.assignment-form {
  display: grid;
  gap: 0.55rem;
}

label {
  display: block;
  color: #e4e9f2;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
}

.validation {
  color: #ffb09d;
  font-size: 0.78rem;
  font-weight: 700;
  margin: 0.4rem 0 0;
}

.assignment-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-top: 1.4rem;
}

@media (max-width: 780px) {
  .assignment-actions {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
