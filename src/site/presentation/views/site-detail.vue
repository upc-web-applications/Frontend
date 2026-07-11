<script setup>
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useSiteStore } from '@/site/application/site.store.js'
import { useAreaStore } from '@/area/application/area.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const siteStore = useSiteStore()
const areaStore = useAreaStore()

const site = computed(() => siteStore.getById(route.params.id))
const areas = computed(() => areaStore.areas.filter(a => a.sedeId === parseInt(route.params.id)))

const riskClass = (n) => ({ 'Bajo':'rg-badge rg-badge-green','Medio':'rg-badge rg-badge-amber','Alto':'rg-badge rg-badge-red','Critico':'rg-badge rg-badge-red' }[n] ?? 'rg-badge rg-badge-gray')

onMounted(() => {
    if (!siteStore.loaded) siteStore.fetchAll()
    if (!areaStore.loaded) areaStore.fetchAll()
})
</script>

<template>
  <div v-if="site">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ site.nombre }}</span>
      </div>
      <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/site/${site.id}/edit`)" />
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="rg-card">
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('sede.name') }}</span><span class="rg-detail-value">{{ site.nombre }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('sede.address') }}</span><span class="rg-detail-value">{{ site.direccion }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('sede.phone') }}</span><span class="rg-detail-value">{{ site.telefono }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('sede.email') }}</span><span class="rg-detail-value">{{ site.email }}</span></div>
        <div class="rg-detail-row">
          <span class="rg-detail-label">{{ t('sede.status') }}</span>
          <span class="rg-detail-value"><span :class="site.estado==='Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'">{{ site.estado }}</span></span>
        </div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('sede.createdAt') }}</span><span class="rg-detail-value">{{ site.fechaCreacion }}</span></div>
      </div>
      <div class="rg-card">
        <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">{{ t('nav.areas') }}</div>
        <div v-for="area in areas" :key="area.id" class="rg-detail-row" style="cursor:pointer" @click="router.push(`/area/${area.id}`)">
          <span class="rg-detail-label">{{ area.codigo }}</span>
          <span class="rg-detail-value" style="display:flex;align-items:center;justify-content:space-between">
            {{ area.nombre }}<span :class="riskClass(area.nivelRiesgo)">{{ area.nivelRiesgo }}</span>
          </span>
        </div>
        <div v-if="!areas.length" style="color:var(--rg-text-muted);font-size:0.82rem">{{ t('common.noData') }}</div>
      </div>
    </div>
  </div>
</template>
