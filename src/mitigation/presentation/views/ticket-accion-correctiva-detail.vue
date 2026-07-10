<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'
import { useVerificacionMedidaStore } from '@/mitigation/application/verificacion-medida.store.js'
import { useHistorialTicketStore } from '@/mitigation/application/historial-ticket.store.js'
import { withSlaEvaluation } from '@/mitigation/application/sla-policy.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTicketAccionCorrectivaStore()
const verifStore = useVerificacionMedidaStore()
const histStore = useHistorialTicketStore()

const ticket = computed(() => {
    const current = store.getById(route.params.id)
    return current ? withSlaEvaluation(current) : null
})
const verificaciones = computed(() => verifStore.verificaciones.filter(v => v.ticketId === parseInt(route.params.id)))
const historiales = computed(() => histStore.historiales.filter(h => h.ticketId === parseInt(route.params.id)))
const ticketStatus = computed(() => normalizeStatus(ticket.value?.estado))

function normalizeStatus(status) {
    const value = (status || '').toString().toLowerCase()
    if (value.includes('pendiente') || value.includes('asignado')) return 'Asignado'
    if (value.includes('progreso') || value.includes('ejecucion')) return 'En ejecucion'
    if (value.includes('implementada') || value.includes('reportada')) return 'Mitigacion reportada'
    if (value.includes('verificacion')) return 'En verificacion'
    if (value.includes('cerrado')) return 'Cerrado'
    if (value.includes('reabierto')) return 'Reabierto'
    return status || 'Asignado'
}

const estadoClass = (s) => ({
    'Asignado':'rg-badge rg-badge-gray',
    'En ejecucion':'rg-badge rg-badge-amber',
    'Mitigacion reportada':'rg-badge rg-badge-purple',
    'En verificacion':'rg-badge rg-badge-orange','Cerrado':'rg-badge rg-badge-green',
    'Reabierto':'rg-badge rg-badge-red'
}[s] ?? 'rg-badge rg-badge-gray')

onMounted(async () => {
    if (!store.loaded) await store.fetchAll()
    await store.refreshSlaStatus()
    if (!verifStore.loaded) verifStore.fetchAll()
    histStore.fetchAll()
})
</script>

<template>
  <div v-if="ticket">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('ticketCorrectivo.title') }} #{{ ticket.ticketNumber || ticket.id }}</span>
      </div>
      <div style="display:flex;gap:8px">
        <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/mitigation/tickets/${ticket.id}/edit`)" />
        <pv-button :label="t('verificacion.new')" icon="pi pi-check-circle" size="small" severity="warn" @click="router.push(`/mitigation/verificaciones/new?ticketId=${ticket.id}`)" />
      </div>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px">
      <div class="rg-card">
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.sector') }}</span><span class="rg-detail-value">{{ ticket.sector }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.riskType') }}</span><span class="rg-detail-value">{{ ticket.tipoRiesgo }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.criticality') }}</span><span class="rg-detail-value">{{ ticket.nivelCriticidad }}</span></div>
        <div class="rg-detail-row">
          <span class="rg-detail-label">{{ t('common.status') }}</span>
          <span class="rg-detail-value"><span :class="estadoClass(ticketStatus)">{{ ticketStatus }}</span></span>
        </div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.technician') }}</span><span class="rg-detail-value">{{ ticket.tecnicoNombre || '-' }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.slaHours') }}</span><span class="rg-detail-value">{{ ticket.slaLimiteHoras }}h {{ ticket.slaIncumplido ? '(SLA incumplido)' : '' }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.createdAt') }}</span><span class="rg-detail-value">{{ ticket.fechaCreacion }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.closedAt') }}</span><span class="rg-detail-value">{{ ticket.fechaCierre || '-' }}</span></div>
        <div class="rg-detail-row"><span class="rg-detail-label">{{ t('ticketCorrectivo.instructions') }}</span><span class="rg-detail-value">{{ ticket.instrucciones || '-' }}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="rg-card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">{{ t('verificacion.title') }}</div>
          <div v-for="v in verificaciones" :key="v.id" class="rg-detail-row" style="cursor:pointer" @click="router.push(`/mitigation/verificaciones/${v.id}`)">
            <span class="rg-detail-label">{{ t('verificacion.veredict') }}</span>
            <span class="rg-detail-value"><span :class="v.veredicto==='Aprobado'?'rg-badge rg-badge-green':'rg-badge rg-badge-red'">{{ v.veredicto || 'Pendiente' }}</span></span>
          </div>
          <div v-if="!verificaciones.length" style="color:var(--rg-text-muted);font-size:0.82rem">{{ t('common.noData') }}</div>
        </div>
        <div class="rg-card">
          <div style="font-size:0.78rem;font-weight:700;color:var(--rg-text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">{{ t('historialTicket.title') }}</div>
          <div v-for="h in historiales" :key="h.id" style="padding:4px 0;border-bottom:1px solid var(--rg-border);font-size:0.78rem">
            <div style="display:flex;justify-content:space-between">
              <span style="font-weight:600">{{ h.evento }}</span>
              <span style="color:var(--rg-text-muted)">#{{ h.id }}</span>
            </div>
            <div style="color:var(--rg-text-muted);margin-top:2px">{{ h.detalles }}</div>
            <div style="color:var(--rg-text-muted);font-size:0.7rem">{{ h.fecha }} - {{ h.usuarioNombre }}</div>
          </div>
          <div v-if="!historiales.length" style="color:var(--rg-text-muted);font-size:0.82rem;margin-top:4px">{{ t('common.noData') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
