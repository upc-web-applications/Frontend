<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'

const router = useRouter()
const { t } = useI18n()
const store = useMonitoringStore()

onMounted(() => {
  if (!store.loaded) store.fetchDashboard()
})

function navigateToAction(asset) {
  if (asset.status === 'Mantenimiento') {
    router.push({ name: 'monitoring-assets-reactivate', params: { id: asset.id } })
    return
  }
  router.push({ name: 'monitoring-assets-detail', params: { id: asset.id } })
}
</script>

<template>
  <div class="content">
    <div class="status-banner mb-4">
      <i class="pi pi-check-circle mr-2"></i>{{ t('dashboard.status') }}
    </div>

    <div class="asset-layout">
      <section>
        <div class="ticket-summary panel p-3 mb-4">
          <span>{{ t('assets.totalAssets') }}</span>
          <strong>{{ store.assets.length }}</strong>
        </div>

        <section class="panel p-4">
          <h1 class="section-title">{{ t('assets.title') }}</h1>
          <pv-data-table class="table-dark" :value="store.assets" :loading="!store.loaded" paginator :rows="6">
            <pv-column field="name" :header="t('assets.asset')" />
            <pv-column field="sector" :header="t('assets.sector')" />
            <pv-column field="status" :header="t('assets.operationalStatus')" />
            <pv-column field="lastReview" :header="t('assets.lastReview')" />
            <pv-column :header="t('tickets.actions')">
              <template #body="slotProps">
                <pv-button
                  v-if="slotProps.data.status !== 'Mantenimiento'"
                  icon="pi pi-plus"
                  rounded
                  text
                  :aria-label="t('assets.detail')"
                  @click="navigateToAction(slotProps.data)" />
                <pv-button
                  v-else
                  icon="pi pi-eye"
                  rounded
                  text
                  :aria-label="t('assets.reactivate')"
                  @click="navigateToAction(slotProps.data)" />
              </template>
            </pv-column>
          </pv-data-table>
        </section>
      </section>

      <aside class="asset-actions">
        <pv-button :label="t('assets.newAsset')" icon="pi pi-plus" class="orange-button action-button" @click="router.push('/monitoring/maintenance/assets/new')" />
        <pv-button :label="t('assets.newMaintenance')" icon="pi pi-plus" class="orange-button action-button" @click="router.push('/monitoring/maintenance/assets/1/maintenance')" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.asset-layout {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 1rem;
  align-items: start;
}

.ticket-summary {
  width: min(520px, 100%);
  min-height: 74px;
}

.ticket-summary span {
  display: block;
  color: #687386;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.ticket-summary strong {
  font-size: 1.6rem;
}

.section-title {
  color: #ff5b00;
  font-size: 0.9rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.asset-actions {
  display: grid;
  gap: 1rem;
  margin-top: 6rem;
}

.action-button {
  min-height: 54px;
}

@media (max-width: 900px) {
  .asset-layout {
    grid-template-columns: 1fr;
  }

  .asset-actions {
    margin-top: 0;
  }
}
</style>
