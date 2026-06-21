<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useVerificacionMedidaStore } from '@/mitigation/application/verificacion-medida.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useVerificacionMedidaStore()

const verif = computed(() => store.getById(route.params.id))

onMounted(() => { if (!store.loaded) store.fetchAll() })

const veredictoClass = (v) => v === 'Aprobado' ? 'rg-badge rg-badge-green' : v === 'Rechazado' ? 'rg-badge rg-badge-red' : 'rg-badge rg-badge-amber'
</script>

<template>
  <div v-if="verif">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('verificacion.title') }} #{{ verif.id }}</span>
      </div>
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('verificacion.ticket') }}</span><span class="rg-detail-value">#{{ verif.ticketId }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('verificacion.supervisor') }}</span><span class="rg-detail-value">{{ verif.supervisorNombre || '-' }}</span></div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('verificacion.veredict') }}</span>
        <span class="rg-detail-value"><span :class="veredictoClass(verif.veredicto)">{{ verif.veredicto || 'Pendiente' }}</span></span>
      </div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('verificacion.comment') }}</span><span class="rg-detail-value">{{ verif.comentarioJustificacion || '-' }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('verificacion.date') }}</span><span class="rg-detail-value">{{ verif.fechaVerificacion }}</span></div>
    </div>
  </div>
</template>
