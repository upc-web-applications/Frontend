<script setup>
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAssetStore } from '@/asset/application/asset.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSiteStore } from '@/site/application/site.store.js'

const { t } = useI18n(); const route = useRoute(); const router = useRouter()
const store = useAssetStore(); const areaStore = useAreaStore(); const siteStore = useSiteStore()
const asset = computed(() => store.getById(route.params.id))
const areaName = computed(() => areaStore.areas.find(a => a.id === asset.value?.areaId)?.nombre ?? '-')
const siteName = computed(() => siteStore.sites.find(s => s.id === asset.value?.sedeId)?.nombre ?? '-')

onMounted(() => { if (!store.loaded) store.fetchAll(); if (!areaStore.loaded) areaStore.fetchAll(); if (!siteStore.loaded) siteStore.fetchAll() })
</script>

<template>
  <div v-if="asset">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ asset.codigo }} — {{ asset.nombre }}</span>
      </div>
      <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/asset/${asset.id}/edit`)" />
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.code') }}</span><span class="rg-detail-value">{{ asset.codigo }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.name') }}</span><span class="rg-detail-value">{{ asset.nombre }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.type') }}</span><span class="rg-detail-value"><span class="rg-badge rg-badge-gray">{{ asset.tipo }}</span></span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.sede') }}</span><span class="rg-detail-value">{{ siteName }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.area') }}</span><span class="rg-detail-value">{{ areaName }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.status') }}</span><span class="rg-detail-value"><span :class="asset.estado==='Activo'?'rg-badge rg-badge-green':'rg-badge rg-badge-gray'">{{ asset.estado }}</span></span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.acquisitionDate') }}</span><span class="rg-detail-value">{{ asset.fechaAdquisicion }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.lastMaintenance') }}</span><span class="rg-detail-value">{{ asset.ultimoMantenimiento }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.description') }}</span><span class="rg-detail-value">{{ asset.descripcion }}</span></div>
    </div>
  </div>
</template>
