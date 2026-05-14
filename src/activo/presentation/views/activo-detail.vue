<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useActivoStore } from '@/activo/application/activo.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSedeStore } from '@/sede/application/sede.store.js'

const { t } = useI18n(); const route = useRoute(); const router = useRouter()
const store = useActivoStore(); const areaStore = useAreaStore(); const sedeStore = useSedeStore()
const activo = computed(() => store.getById(route.params.id))
const areaName = computed(() => areaStore.areas.find(a => a.id === activo.value?.areaId)?.nombre ?? '-')
const sedeName = computed(() => sedeStore.sedes.find(s => s.id === activo.value?.sedeId)?.nombre ?? '-')

onMounted(() => { if (!store.loaded) store.fetchAll(); if (!areaStore.loaded) areaStore.fetchAll(); if (!sedeStore.loaded) sedeStore.fetchAll() })
</script>

<template>
  <div v-if="activo">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ activo.codigo }} — {{ activo.nombre }}</span>
      </div>
      <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/activo/${activo.id}/edit`)" />
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.code') }}</span><span class="rg-detail-value">{{ activo.codigo }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.name') }}</span><span class="rg-detail-value">{{ activo.nombre }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.type') }}</span><span class="rg-detail-value"><span class="rg-badge rg-badge-gray">{{ activo.tipo }}</span></span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.sede') }}</span><span class="rg-detail-value">{{ sedeName }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.area') }}</span><span class="rg-detail-value">{{ areaName }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.status') }}</span><span class="rg-detail-value"><span :class="activo.estado==='Activo'?'rg-badge rg-badge-green':'rg-badge rg-badge-gray'">{{ activo.estado }}</span></span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.acquisitionDate') }}</span><span class="rg-detail-value">{{ activo.fechaAdquisicion }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.lastMaintenance') }}</span><span class="rg-detail-value">{{ activo.ultimoMantenimiento }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('activo.description') }}</span><span class="rg-detail-value">{{ activo.descripcion }}</span></div>
    </div>
  </div>
</template>
