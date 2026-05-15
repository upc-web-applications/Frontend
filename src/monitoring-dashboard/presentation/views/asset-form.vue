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
  brand: '',
  sector: '',
  riskLevel: 'Bajo',
  lastReview: '',
  status: 'Operativo'
})

const isEdit = computed(() => !!route.params.id)
const pageTitle = computed(() => isEdit.value && form.value.name ? `Activo "${form.value.name}"` : t('assets.newAsset'))
const riskOptions = ['Bajo', 'Medio', 'Alto', 'Critico']
const sectorOptions = computed(() => store.sectors.map(sector => sector.name))

onMounted(() => {
  const request = store.loaded ? Promise.resolve() : store.fetchDashboard()
  request.then(() => {
    if (isEdit.value) {
      const asset = store.getAssetById(route.params.id)
      if (!asset) {
        router.push('/monitoring/maintenance')
        return
      }
      form.value = { ...asset }
    }
  })
})

function saveAsset() {
  const action = isEdit.value ? store.updateAsset(form.value) : store.addAsset(form.value)
  action.then(() => router.push('/monitoring/maintenance'))
}
</script>

<template>
  <div class="content">
    <section class="panel p-4 asset-form-panel">
      <h1>{{ pageTitle }}</h1>
      <form class="asset-form" @submit.prevent="saveAsset">
        <label>{{ t('assets.assetName') }}</label>
        <pv-input-text v-model="form.name" class="w-full" required />

        <label>{{ t('assets.assetCode') }}</label>
        <pv-input-text v-model="form.code" class="w-full" :disabled="isEdit" required />

        <label>{{ t('assets.brand') }}</label>
        <pv-input-text v-model="form.brand" class="w-full" required />

        <label>{{ t('assets.sector') }}</label>
        <pv-select v-model="form.sector" :options="sectorOptions" class="w-full" required />

        <label>{{ t('assets.criticality') }}</label>
        <pv-select v-model="form.riskLevel" :options="riskOptions" class="w-full" required />

        <label>{{ t('assets.lastReview') }}</label>
        <input v-model="form.lastReview" class="date-input" type="date" :disabled="isEdit" required />

        <div class="form-actions">
          <pv-button :label="t('tickets.cancel')" class="orange-button" @click="router.push('/monitoring/maintenance')" />
          <pv-button :label="t('assets.saveChanges')" class="orange-button" type="submit" />
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.asset-form-panel {
  max-width: 1040px;
  margin: 0 auto;
}

.asset-form-panel h1 {
  color: #ff5b00;
  font-size: 0.95rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.asset-form {
  display: grid;
  gap: 0.65rem;
}

label {
  color: #e4e9f2;
  font-size: 0.76rem;
  font-weight: 700;
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
