<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useHazardStore } from '@/hazard/application/hazard.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useHazardStore()

const hazard = computed(() => store.getById(route.params.id))
const riskClass = (n) => ({ 'Bajo':'rg-badge rg-badge-green','Medio':'rg-badge rg-badge-amber','Alto':'rg-badge rg-badge-red','Critico':'rg-badge rg-badge-red' }[n] ?? 'rg-badge rg-badge-gray')

onMounted(() => { if (!store.loaded) store.fetchAll() })
</script>

<template>
  <div v-if="hazard">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ hazard.nombre }}</span>
      </div>
      <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/hazard/${hazard.id}/edit`)" />
    </div>
    <div class="rg-card" style="max-width:600px">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('peligro.code') }}</span><span class="rg-detail-value">{{ hazard.codigo }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('peligro.name') }}</span><span class="rg-detail-value">{{ hazard.nombre }}</span></div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('peligro.type') }}</span>
        <span class="rg-detail-value"><span class="rg-badge rg-badge-orange">{{ hazard.tipo }}</span></span>
      </div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('peligro.description') }}</span><span class="rg-detail-value">{{ hazard.descripcion || '-' }}</span></div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('peligro.baseRisk') }}</span>
        <span class="rg-detail-value"><span :class="riskClass(hazard.nivelRiesgoBase)">{{ hazard.nivelRiesgoBase }}</span></span>
      </div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('peligro.status') }}</span>
        <span class="rg-detail-value"><span :class="hazard.estado==='Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'">{{ hazard.estado }}</span></span>
      </div>
    </div>
  </div>
</template>
