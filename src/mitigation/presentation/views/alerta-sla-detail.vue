<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAlertaSLAStore } from '@/mitigation/application/alerta-sla.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useAlertaSLAStore()

const alerta = computed(() => store.getById(route.params.id))

onMounted(() => { if (!store.loaded) store.fetchAll() })
</script>

<template>
  <div v-if="alerta">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('alertaSLA.alert') }} #{{ alerta.id }}</span>
      </div>
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaSLA.ticket') }}</span><span class="rg-detail-value">#{{ alerta.ticketId }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaSLA.hoursElapsed') }}</span><span class="rg-detail-value">{{ alerta.horasTranscurridas }}h</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaSLA.slaLimit') }}</span><span class="rg-detail-value">{{ alerta.slaLimiteHoras }}h</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaSLA.alertDate') }}</span><span class="rg-detail-value">{{ alerta.fechaAlerta }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('alertaSLA.notifiedTo') }}</span><span class="rg-detail-value">{{ alerta.notificadoNombre || '-' }}</span></div>
    </div>
  </div>
</template>
