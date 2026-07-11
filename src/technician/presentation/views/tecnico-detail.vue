<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useTecnicoStore } from '@/technician/application/tecnico.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTecnicoStore()

const tecnico = computed(() => store.getById(route.params.id))

onMounted(() => { if (!store.loaded) store.fetchAll() })

const estadoClass = (e) => e === 'Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'
</script>

<template>
  <div v-if="tecnico">
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ tecnico.nombreCompleto }}</span>
      </div>
      <pv-button :label="t('common.edit')" icon="pi pi-pencil" size="small" @click="router.push(`/technicians/${tecnico.id}/edit`)" />
    </div>
    <div class="rg-card">
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('tecnico.document') }}</span><span class="rg-detail-value">{{ tecnico.numeroDocumento }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('tecnico.fullName') }}</span><span class="rg-detail-value">{{ tecnico.nombreCompleto }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('tecnico.specialty') }}</span><span class="rg-detail-value">{{ tecnico.especialidad || '-' }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('tecnico.phone') }}</span><span class="rg-detail-value">{{ tecnico.telefono || '-' }}</span></div>
      <div class="rg-detail-row"><span class="rg-detail-label">{{ t('tecnico.email') }}</span><span class="rg-detail-value">{{ tecnico.email || '-' }}</span></div>
      <div class="rg-detail-row">
        <span class="rg-detail-label">{{ t('common.status') }}</span>
        <span class="rg-detail-value"><span :class="estadoClass(tecnico.estado)">{{ tecnico.estado }}</span></span>
      </div>
    </div>
  </div>
</template>
