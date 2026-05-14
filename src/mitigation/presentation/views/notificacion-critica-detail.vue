<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useNotificacionCriticaStore } from '@/mitigation/application/notificacion-critica.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useNotificacionCriticaStore()

const notif = computed(() => store.getById(route.params.id))

onMounted(() => { if (!store.loaded) store.fetchAll() })

const enviadaClass = (e) => e ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-amber'
</script>

<template>
  <div v-if="notif">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('notificacionCritica.title') }} #{{ notif.id }}</span>
      </div>
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('notificacionCritica.ticket') }}</span><span class="rg-detail-value">#{{ notif.ticketId }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('notificacionCritica.message') }}</span><span class="rg-detail-value">{{ notif.mensaje }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('notificacionCritica.supervisor') }}</span><span class="rg-detail-value">{{ notif.supervisorNombre || '-' }}</span></div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('notificacionCritica.sent') }}</span>
        <span class="rg-detail-value"><span :class="enviadaClass(notif.enviada)">{{ notif.enviada ? t('common.yes') : t('common.no') }}</span></span>
      </div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('notificacionCritica.sendDate') }}</span><span class="rg-detail-value">{{ notif.fechaEnvio || '-' }}</span></div>
    </div>
  </div>
</template>
