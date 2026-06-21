<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useMonitoringStore from '@/monitoring-dashboard/application/monitoring.store.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const store = useMonitoringStore()

const asset = computed(() => store.getAssetById(route.params.id))

onMounted(() => {
  const request = store.loaded ? Promise.resolve() : store.fetchDashboard()
  request.then(() => {
    if (!asset.value) router.push('/monitoring/maintenance')
  })
})

function reactivateAsset() {
  store.reactivateAsset(asset.value).then(() => {
    router.push('/monitoring/maintenance')
  })
}
</script>

<template>
  <div class="content">
    <h1 v-if="asset" class="asset-title">Activo "{{ asset.name }}"</h1>
    <section v-if="asset" class="panel reactivate-panel p-5">
      <div class="warning-diamond">!</div>
      <p>{{ t('assets.reactivateQuestion', { name: asset.name }) }}</p>
      <div class="reactivate-actions">
        <pv-button :label="t('tickets.cancel')" class="orange-button" @click="router.push('/monitoring/maintenance')" />
        <pv-button :label="t('assets.reactivate')" class="orange-button" @click="reactivateAsset" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.asset-title {
  color: #ff5b00;
  font-size: 0.95rem;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.reactivate-panel {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.warning-diamond {
  width: 150px;
  height: 150px;
  background: #ff7a17;
  color: #0a0c0f;
  display: grid;
  place-items: center;
  font-size: 5rem;
  font-weight: 800;
  transform: rotate(45deg);
  margin-bottom: 2.5rem;
}

.warning-diamond::first-letter {
  transform: rotate(-45deg);
}

.warning-diamond {
  line-height: 1;
}

.warning-diamond {
  text-indent: 0;
}

.warning-diamond {
  writing-mode: horizontal-tb;
}

.warning-diamond {
  font-family: Arial, Helvetica, sans-serif;
}

.warning-diamond {
  box-shadow: 0 0 0 1px rgba(255, 122, 23, 0.2);
}

.warning-diamond {
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  transform: none;
}

.reactivate-panel p {
  font-weight: 700;
  text-transform: uppercase;
}

.reactivate-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: min(430px, 100%);
  margin-top: 1.5rem;
}

@media (max-width: 680px) {
  .reactivate-actions {
    grid-template-columns: 1fr;
  }
}
</style>
