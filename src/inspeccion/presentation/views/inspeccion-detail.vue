<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useInspeccionStore } from '@/inspeccion/application/inspeccion.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useActivoStore } from '@/activo/application/activo.store.js'
import { useSedeStore } from '@/sede/application/sede.store.js'

const { t } = useI18n(); const route = useRoute(); const router = useRouter()
const store = useInspeccionStore(); const areaStore = useAreaStore()
const activoStore = useActivoStore(); const sedeStore = useSedeStore()
const showPhoto = ref(false)

const inspeccion = computed(() => store.getById(route.params.id))
const areaName   = computed(() => areaStore.areas.find(a => a.id === inspeccion.value?.areaId)?.nombre ?? '-')
const sedeName   = computed(() => sedeStore.sedes.find(s => s.id === inspeccion.value?.sedeId)?.nombre ?? '-')
const activoName = computed(() => activoStore.activos.find(a => a.id === inspeccion.value?.activoId)?.nombre ?? 'No vinculado')

const urgClass  = (u) => ({ 'Alto':'rg-badge rg-badge-red','Medio':'rg-badge rg-badge-amber','Bajo':'rg-badge rg-badge-green' }[u] ?? 'rg-badge rg-badge-gray')
const statClass = (s) => ({ 'Pendiente':'rg-badge rg-badge-amber','En Progreso':'rg-badge rg-badge-orange','Resuelto':'rg-badge rg-badge-green' }[s] ?? 'rg-badge rg-badge-gray')
const fmtDate   = (d) => d ? new Date(d).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-'

const statusBg = computed(() => ({ 'Pendiente':'rgba(245,158,11,0.08)','En Progreso':'rgba(232,70,10,0.08)','Resuelto':'rgba(34,197,94,0.08)' }[inspeccion.value?.estado] ?? 'transparent'))
const statusBorder = computed(() => ({ 'Pendiente':'rgba(245,158,11,0.25)','En Progreso':'rgba(232,70,10,0.25)','Resuelto':'rgba(34,197,94,0.25)' }[inspeccion.value?.estado] ?? 'transparent'))
const statusColor  = computed(() => ({ 'Pendiente':'#f59e0b','En Progreso':'#E8460A','Resuelto':'#22c55e' }[inspeccion.value?.estado] ?? 'white'))

onMounted(() => {
    if (!store.loaded) store.fetchAll()
    if (!areaStore.loaded) areaStore.fetchAll()
    if (!activoStore.loaded) activoStore.fetchAll()
    if (!sedeStore.loaded) sedeStore.fetchAll()
})
</script>

<template>
  <div v-if="inspeccion">
    <!-- Status banner -->
    <div :style="{ background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: '8px', padding: '8px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }">
      <span :style="{ color: statusColor, fontWeight: 700, fontSize: '0.82rem' }">{{ inspeccion.estado }}</span>
      <span style="color:var(--rg-text-muted);font-size:0.78rem;margin-left:auto">{{ inspeccion.ticket }}</span>
    </div>

    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ inspeccion.ticket }}</span>
      </div>
      <span :class="urgClass(inspeccion.nivelUrgencia)">{{ inspeccion.nivelUrgencia }}</span>
    </div>

    <div style="display:grid;grid-template-columns:55% 45%;gap:12px">
      <!-- LEFT -->
      <div class="rg-card">
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.type') }}</span><span class="rg-detail-value">{{ inspeccion.tipoIncidente }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.sede') }}</span><span class="rg-detail-value">{{ sedeName }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.area') }}</span><span class="rg-detail-value">{{ areaName }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.asset') }}</span><span class="rg-detail-value">{{ activoName }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.urgency') }}</span><span class="rg-detail-value"><span :class="urgClass(inspeccion.nivelUrgencia)">{{ inspeccion.nivelUrgencia }}</span></span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.status') }}</span><span class="rg-detail-value"><span :class="statClass(inspeccion.estado)">{{ inspeccion.estado }}</span></span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.reportDate') }}</span><span class="rg-detail-value">{{ fmtDate(inspeccion.fechaReporte) }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('inspeccion.description') }}</span><span class="rg-detail-value" style="line-height:1.6">{{ inspeccion.descripcion }}</span></div>
        <div v-if="inspeccion.estado === 'Resuelto' && inspeccion.accionCorrectiva" style="margin-top:12px;padding:12px;background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:8px">
          <div style="font-size:0.72rem;font-weight:700;color:var(--rg-green);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">{{ t('inspeccion.correctiveAction') }}</div>
          <div style="font-size:0.85rem;color:var(--rg-text);line-height:1.6">{{ inspeccion.accionCorrectiva }}</div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="rg-card" style="display:flex;flex-direction:column;gap:12px">
        <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em">Evidencia fotográfica</div>
        <div v-if="inspeccion.fotoUrl">
          <img :src="inspeccion.fotoUrl" style="width:100%;border-radius:8px;border:1px solid var(--rg-border);cursor:pointer" @click="showPhoto = true" />
          <div style="font-size:0.72rem;color:var(--rg-text-muted);margin-top:6px;text-align:center">Click para ampliar</div>
        </div>
        <div v-else style="border:1px dashed var(--rg-border);border-radius:8px;height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
          <i class="pi pi-image" style="font-size:32px;color:var(--rg-border)" />
          <span style="font-size:0.78rem;color:var(--rg-text-muted)">{{ t('inspeccion.noPhoto') }}</span>
        </div>
        <div style="padding:12px;background:var(--rg-bg-3);border-radius:8px;border:1px solid var(--rg-border)">
          <div style="font-size:0.62rem;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Ticket</div>
          <div style="font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--rg-primary)">{{ inspeccion.ticket }}</div>
        </div>
      </div>
    </div>

    <!-- Photo modal -->
    <div v-if="showPhoto" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center" @click="showPhoto = false">
      <img :src="inspeccion.fotoUrl" style="max-width:90vw;max-height:90vh;border-radius:8px" />
    </div>
  </div>
  <div v-else style="padding:40px;text-align:center;color:var(--rg-text-muted)">Cargando...</div>
</template>
