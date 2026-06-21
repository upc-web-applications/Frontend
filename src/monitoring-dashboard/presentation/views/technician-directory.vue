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

    <div class="technician-summary panel p-3 mb-4">
      <span>{{ t('technicians.total') }}</span>
      <strong>{{ store.technicians.length }}</strong>
    </div>

    <div class="directory-layout">
      <section class="panel p-4">
        <h1 class="section-title">{{ t('technicians.active') }}</h1>
        <pv-data-table class="table-dark" :value="store.technicians" :loading="!store.loaded" paginator :rows="4">
          <pv-column :header="t('technicians.id')">
            <template #body="slotProps">
              {{ slotProps.data.code || `TEC-${String(slotProps.data.id).padStart(2, '0')}` }}
            </template>
          </pv-column>
          <pv-column field="fullName" :header="t('technicians.name')" />
          <pv-column field="specialty" :header="t('technicians.specialty')" />
          <pv-column field="status" :header="t('tickets.status')" />
          <pv-column :header="t('tickets.actions')">
            <template #body="slotProps">
              <pv-button
                icon="pi pi-eye"
                rounded
                text
                :aria-label="t('technicians.detail')"
                @click="router.push({ name: 'monitoring-technicians-detail', params: { id: slotProps.data.id } })" />
            </template>
          </pv-column>
        </pv-data-table>
      </section>

      <aside class="side-actions">
        <pv-button :label="t('technicians.newTechnician')" icon="pi pi-plus" class="orange-button action-button" @click="router.push('/monitoring/technicians/new')" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.technician-summary {
  width: min(520px, 100%);
  min-height: 74px;
}

.technician-summary span {
  display: block;
  color: #687386;
  font-size: 0.72rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.technician-summary strong {
  font-size: 1.55rem;
}

.directory-layout {
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
  .directory-layout {
    grid-template-columns: 1fr;
  }

  .side-actions {
    margin-top: 0;
  }
}
</style>
