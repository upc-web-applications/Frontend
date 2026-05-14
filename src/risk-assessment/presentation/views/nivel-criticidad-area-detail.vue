<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useNivelCriticidadAreaStore } from '@/risk-assessment/application/nivel-criticidad-area.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useNivelCriticidadAreaStore()

const nivel = computed(() => store.getById(route.params.id))

onMounted(() => { if (!store.loaded) store.fetchAll() })

const criticidadClass = (n) => ({
    'Tolerable': 'rg-badge rg-badge-green',
    'Moderado': 'rg-badge rg-badge-amber',
    'Importante': 'rg-badge rg-badge-orange',
    'Crítico': 'rg-badge rg-badge-red'
}[n] ?? 'rg-badge rg-badge-gray')
</script>

<template>
  <div v-if="nivel">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ nivel.sector }}</span>
      </div>
    </div>
    <div class="rg-card">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <div style="font-size:0.75rem;color:var(--rg-text-muted);margin-bottom:4px">{{ t('nivelCriticidad.level') }}</div>
          <div><span :class="criticidadClass(nivel.nivelCriticidad)" style="font-size:1rem">{{ nivel.nivelCriticidad }}</span></div>
        </div>
        <div>
          <div style="font-size:0.75rem;color:var(--rg-text-muted);margin-bottom:4px">{{ t('nivelCriticidad.heatIntensity') }}</div>
          <div>{{ nivel.intensidadMapa }}</div>
        </div>
        <div>
          <div style="font-size:0.75rem;color:var(--rg-text-muted);margin-bottom:4px">{{ t('nivelCriticidad.sector') }}</div>
          <div>{{ nivel.sector }}</div>
        </div>
        <div>
          <div style="font-size:0.75rem;color:var(--rg-text-muted);margin-bottom:4px">{{ t('nivelCriticidad.lastUpdate') }}</div>
          <div>{{ nivel.ultimaActualizacion }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
