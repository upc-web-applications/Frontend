<script setup>
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useNivelCriticidadAreaStore } from '@/risk-assessment/application/nivel-criticidad-area.store.js'

const { t } = useI18n()
const router = useRouter()
const store = useNivelCriticidadAreaStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const intensidadColor = (i) => ({
    'baja': 'var(--rg-green)',
    'media': 'var(--rg-amber)',
    'alta': 'var(--rg-red)',
    'muy_alta': '#b91c1c'
}[i] ?? '#6b7280')

const intensidadLabel = (i) => ({
    'baja': t('nivelCriticidad.low'),
    'media': t('nivelCriticidad.medium'),
    'alta': t('nivelCriticidad.high'),
    'muy_alta': t('nivelCriticidad.veryHigh')
}[i] ?? i)

const criticidadClass = (n) => ({
    'Tolerable': 'rg-badge rg-badge-green',
    'Moderado': 'rg-badge rg-badge-amber',
    'Importante': 'rg-badge rg-badge-orange',
    'Crítico': 'rg-badge rg-badge-red'
}[n] ?? 'rg-badge rg-badge-gray')
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('nivelCriticidad.title') }}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
      <div v-for="nivel in store.niveles" :key="nivel.id" class="rg-card" style="cursor:pointer" @click="router.push(`/risk-assessment/mapa-calor/${nivel.id}`)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-weight:600;font-size:0.95rem">{{ nivel.sector }}</span>
          <span :class="criticidadClass(nivel.nivelCriticidad)">{{ nivel.nivelCriticidad }}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div :style="{width:'100%',height:'8px',background:'var(--rg-border)',borderRadius:'4px',overflow:'hidden'}">
            <div :style="{width:'100%',height:'100%',background:intensidadColor(nivel.intensidadMapa),borderRadius:'4px',opacity:'0.8'}"></div>
          </div>
          <span style="font-size:0.75rem;color:var(--rg-text-muted);white-space:nowrap">{{ intensidadLabel(nivel.intensidadMapa) }}</span>
        </div>
        <div style="font-size:0.7rem;color:var(--rg-text-muted);margin-top:6px">{{ t('nivelCriticidad.lastUpdate') }}: {{ nivel.ultimaActualizacion }}</div>
      </div>
    </div>
    <div v-if="!store.niveles.length" class="rg-card" style="text-align:center;color:var(--rg-text-muted);padding:24px">{{ t('common.noData') }}</div>
  </div>
</template>
