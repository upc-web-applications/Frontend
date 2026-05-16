<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'
import { useHistorialTicketStore } from '@/mitigation/application/historial-ticket.store.js'
import { useTecnicoStore } from '@/technician/application/tecnico.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useTicketAccionCorrectivaStore()
const historialStore = useHistorialTicketStore()
const tecnicoStore = useTecnicoStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ reporteId: null, sectorId: null, sector: '', tipoRiesgo: '', nivelCriticidad: '', estado: 'Pendiente', instrucciones: '', tecnicoAsignadoId: null, tecnicoNombre: '', fechaCreacion: new Date().toISOString().split('T')[0], fechaCierre: '', slaLimiteHoras: 48, slaIncumplido: false })

onMounted(async () => {
    if (!tecnicoStore.loaded) await tecnicoStore.fetchAll()
    if (!historialStore.loaded) await historialStore.fetchAll()
    if (isEdit.value) {
        if (!store.loaded) await store.fetchAll()
        const e = store.getById(route.params.id)
        if (e) Object.assign(form.value, { ...e })
    }
})

const submit = async () => {
    if (form.value.tecnicoAsignadoId) {
        const t = tecnicoStore.getById(form.value.tecnicoAsignadoId)
        form.value.tecnicoNombre = t ? t.nombreCompleto : ''
    }
    saving.value = true
    try {
        if (isEdit.value) {
            const updated = await store.update({ ...form.value, id: parseInt(route.params.id) })
            if (updated) {
                await historialStore.add({ ticketId: updated.id, evento: 'Ticket actualizado', usuarioId: 1, usuarioNombre: 'Victor Jhosef Laura Acosta', detalles: `Estado cambiado a: ${updated.estado}`, fecha: new Date().toISOString().split('T')[0] })
            }
        } else {
            const created = await store.add({ ...form.value })
            if (created && created.id) {
                await historialStore.add({ ticketId: created.id, evento: 'Ticket creado', usuarioId: 1, usuarioNombre: 'Victor Jhosef Laura Acosta', detalles: `Ticket creado para ${created.sector || 'sector asignado'}`, fecha: created.fechaCreacion || new Date().toISOString().split('T')[0] })
            }
        }
        toast.add({ severity: 'success', summary: t('ticketCorrectivo.saveSuccess'), life: 3000 })
        router.push('/mitigation/tickets')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('ticketCorrectivo.editTitle') : t('ticketCorrectivo.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.riskType') }} *</label>
          <pv-input-text v-model="form.tipoRiesgo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.criticality') }}</label>
          <pv-select v-model="form.nivelCriticidad" :options="['Tolerable','Moderado','Importante','Crítico']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.sector') }} *</label>
          <pv-input-text v-model="form.sector" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('common.status') }}</label>
          <pv-select v-model="form.estado" :options="['Pendiente','En Progreso','Medida Implementada','Cerrado','SLA Incumplido','Escalado']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.technician') }}</label>
          <pv-select v-model="form.tecnicoAsignadoId" :options="tecnicoStore.tecnicos" option-label="nombreCompleto" option-value="id" :placeholder="t('ticketCorrectivo.selectTechnician')" size="small" style="width:100%" show-clear />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.slaHours') }}</label>
          <pv-input-number v-model="form.slaLimiteHoras" :min="1" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.createdAt') }}</label>
          <pv-input-text v-model="form.fechaCreacion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.closedAt') }}</label>
          <pv-input-text v-model="form.fechaCierre" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('ticketCorrectivo.instructions') }}</label>
          <pv-textarea v-model="form.instrucciones" size="small" style="width:100%" rows="3" />
        </div>
      </div>
    </div>
  </div>
</template>
