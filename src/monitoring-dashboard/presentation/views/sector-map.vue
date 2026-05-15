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
</script>

<template>
  <div class="content">
    <div class="status-banner mb-4">
      <i class="pi pi-check-circle mr-2"></i>{{ t('dashboard.status') }}
    </div>

    <div class="sector-summary">
      <div class="panel p-3 summary-box">
        <span>{{ t('sectors.totalSectors') }}</span>
        <strong>{{ store.totalSectorsCount }}</strong>
      </div>
      <div class="panel p-3 summary-box">
        <span>{{ t('assets.totalAssets') }}</span>
        <strong>{{ store.totalAssetsCount }}</strong>
      </div>
    </div>

    <div class="sector-layout">
      <section class="panel p-4">
        <h1 class="section-title">{{ t('sectors.title') }}</h1>
        <pv-data-table class="table-dark" :value="store.sectors" :loading="!store.loaded" paginator :rows="4">
          <pv-column field="name" :header="t('sectors.sector')" />
          <pv-column field="riskLevel" :header="t('sectors.riskLevel')" />
          <pv-column :header="t('sectors.assets')">
            <template #body="slotProps">
              {{ store.getAssetsCountBySector(slotProps.data) }}
            </template>
          </pv-column>
          <pv-column :header="t('tickets.status')">
            <template #body="slotProps">
              {{ slotProps.data.status || 'Activo' }}
            </template>
          </pv-column>
          <pv-column :header="t('tickets.actions')">
            <template #body="slotProps">
              <pv-button
                icon="pi pi-eye"
                rounded
                text
                :aria-label="t('sectors.detail')"
                @click="router.push({ name: 'monitoring-sectors-detail', params: { id: slotProps.data.id } })" />
            </template>
          </pv-column>
        </pv-data-table>
      </section>

      <aside class="side-actions">
        <pv-button :label="t('sectors.newSector')" icon="pi pi-plus" class="orange-button action-button" @click="router.push('/monitoring/sectors/new')" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.sector-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 3rem;
  margin-bottom: 1.6rem;
}

.summary-box {
  min-height: 74px;
}

.summary-box span {
  display: block;
  color: #687386;
  font-size: 0.72rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.summary-box strong {
  font-size: 1.55rem;
}

.sector-layout {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 1rem;
  align-items: start;
}

.section-title {
  color: #ff5b00;
  font-size: 0.86rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.side-actions {
  margin-top: 3.2rem;
}

.action-button {
  min-height: 54px;
  width: 100%;
}

@media (max-width: 900px) {
  .sector-summary,
  .sector-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .side-actions {
    margin-top: 0;
  }
}
</style>
