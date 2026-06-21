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
  assetId: null,
  technician: '',
  startDate: '',
  reactivationDate: '',
  description: ''
})

const operativeAssets = computed(() => store.assets.filter(asset => asset.status !== 'Mantenimiento'))

onMounted(() => {
  const request = store.loaded ? Promise.resolve() : store.fetchDashboard()
  request.then(() => {
    const requestedAsset = store.getAssetById(route.params.id)
    form.value.assetId = requestedAsset && requestedAsset.status !== 'Mantenimiento'
      ? requestedAsset.id
      : (operativeAssets.value[0] ? operativeAssets.value[0].id : null)
  })
})

function saveMaintenance() {
  store.addMaintenance(form.value).then(() => {
    router.push('/monitoring/maintenance')
  })
}
</script>

<template>
  <div class="content">
    <section class="panel p-4 maintenance-form-panel">
      <h1>{{ t('assets.newMaintenance') }}</h1>
      <form class="maintenance-form" @submit.prevent="saveMaintenance">
        <label>{{ t('maintenance.asset') }}</label>
        <pv-select v-model="form.assetId" :options="operativeAssets" option-label="name" option-value="id" class="w-full" required />

        <label>{{ t('maintenance.technician') }}</label>
        <pv-select v-model="form.technician" :options="store.technicians" option-label="fullName" option-value="fullName" class="w-full" required />

        <div class="date-grid">
          <div>
            <label>{{ t('assets.startDate') }}</label>
            <input v-model="form.startDate" class="date-input" type="date" required />
          </div>
          <div>
            <label>{{ t('assets.reactivationDate') }}</label>
            <input v-model="form.reactivationDate" class="date-input" type="date" required />
          </div>
        </div>

        <label>{{ t('maintenance.description') }}</label>
        <pv-input-text v-model="form.description" class="w-full" :placeholder="t('assets.maintenanceDetails')" required />

        <div class="form-actions">
          <pv-button :label="t('tickets.cancel')" class="orange-button" @click="router.push('/monitoring/maintenance')" />
          <pv-button :label="t('tickets.accept')" class="orange-button" type="submit" />
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.maintenance-form-panel {
  max-width: 1060px;
  margin: 0 auto;
}

.maintenance-form-panel h1 {
  color: #ff5b00;
  font-size: 0.95rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.maintenance-form {
  display: grid;
  gap: 0.65rem;
}

.date-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

label {
  display: block;
  color: #e4e9f2;
  font-size: 0.76rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.date-input {
  width: 100%;
  min-height: 42px;
  border: 1px solid #263142;
  border-radius: 6px;
  background: #070d17;
  color: #e6ebf5;
  padding: 0.6rem;
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 1.5rem;
}

@media (max-width: 780px) {
  .date-grid,
  .form-actions {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
