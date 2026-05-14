<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSedeStore } from '@/sede/application/sede.store.js'
import { useActivoStore } from '@/activo/application/activo.store.js'

const { t } = useI18n(); const route = useRoute(); const router = useRouter()
const store = useAreaStore(); const sedeStore = useSedeStore(); const activoStore = useActivoStore()
const area = computed(() => store.getById(route.params.id))
const sedeName = computed(() => sedeStore.sedes.find(s => s.id === area.value?.sedeId)?.nombre ?? '-')
const activos = computed(() => activoStore.activos.filter(a => a.areaId === parseInt(route.params.id)))
const riskClass = (n) => ({ 'Bajo':'rg-badge rg-badge-green','Medio':'rg-badge rg-badge-amber','Alto':'rg-badge rg-badge-red','Crítico':'rg-badge rg-badge-red' }[n] ?? 'rg-badge rg-badge-gray')

onMounted(() => { if (!store.loaded) store.fetchAll(); if (!sedeStore.loaded) sedeStore.fetchAll(); if (!activoStore.loaded) activoStore.fetchAll() })
</script>

<template>
  <div v-if="area">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ area.nombre }}</span>
      </div>
      <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/area/${area.id}/edit`)" />
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="rg-card">
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('area.name') }}</span><span class="rg-detail-value">{{ area.nombre }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('area.code') }}</span><span class="rg-detail-value">{{ area.codigo }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('area.sede') }}</span><span class="rg-detail-value">{{ sedeName }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('area.riskLevel') }}</span><span class="rg-detail-value"><span :class="riskClass(area.nivelRiesgo)">{{ area.nivelRiesgo }}</span></span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('area.status') }}</span><span class="rg-detail-value"><span :class="area.estado==='Activo'?'rg-badge rg-badge-green':'rg-badge rg-badge-gray'">{{ area.estado }}</span></span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('area.description') }}</span><span class="rg-detail-value">{{ area.descripcion }}</span></div>
      </div>
      <div class="rg-card">
        <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">{{ t('nav.activos') }}</div>
        <div v-for="a in activos" :key="a.id" class="rg-detail-row" style="cursor:pointer" @click="router.push(`/activo/${a.id}`)">
          <span class="rg-detail-label">{{ a.codigo }}</span>
          <span class="rg-detail-value" style="display:flex;align-items:center;justify-content:space-between">{{ a.nombre }}<span :class="a.estado==='Activo'?'rg-badge rg-badge-green':'rg-badge rg-badge-gray'">{{ a.estado }}</span></span>
        </div>
        <div v-if="!activos.length" style="color:var(--rg-text-muted);font-size:0.82rem">{{ t('common.noData') }}</div>
      </div>
    </div>
  </div>
</template>
