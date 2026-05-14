<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useMitigationStore } from '@/mitigation/application/mitigation.store.js'
import { useRiskAssessmentStore } from '@/risk-assessment/application/risk-assessment.store.js'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'
import { useHistorialTicketStore } from '@/mitigation/application/historial-ticket.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useMitigationStore()
const assessmentStore = useRiskAssessmentStore()
const ticketStore = useTicketAccionCorrectivaStore()
const historialStore = useHistorialTicketStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref({ riskAssessmentId: route.query.assessmentId || null, ticketId: null, codigo:'', descripcion:'', responsable:'', fechaAsignacion: new Date().toISOString().split('T')[0], fechaEjecucion:'', estado:'Pendiente', resultado:'', observaciones:'' })

onMounted(() => {
    if (!assessmentStore.loaded) assessmentStore.fetchAll()
    if (!ticketStore.loaded) ticketStore.fetchAll()
    if (isEdit.value) {
        if (!store.loaded) store.fetchAll()
        const e = store.getById(route.params.id)
        if (e) Object.assign(form.value, e)
    }
})

const submit = async () => {
    saving.value = true
    try {
        const payload = { ...form.value }
        if (isEdit.value) {
            const updated = await store.update({ ...payload, id: parseInt(route.params.id) })
            if (updated && updated.ticketId) {
                const tk = ticketStore.getById(updated.ticketId)
                if (tk) {
                    const newStatus = updated.estado === 'Implementado' ? 'Medida Implementada' : updated.estado === 'Verificado' ? 'En Progreso' : updated.estado === 'Cerrado' ? 'Cerrado' : null
                    if (newStatus && tk.estado !== newStatus) {
                        await ticketStore.update({ ...tk, estado: newStatus })
                        await historialStore.add({ ticketId: tk.id, evento: 'Mitigación actualizada', usuarioId: 1, usuarioNombre: 'Victor Jhosef Laura Acosta', detalles: `Mitigación ${updated.codigo}: ${updated.estado}`, fecha: new Date().toISOString().split('T')[0] })
                    }
                }
            }
        } else {
            const created = await store.add(payload)
            if (created && created.ticketId) {
                const tk = ticketStore.getById(created.ticketId)
                if (tk && created.estado === 'Implementado') {
                    await ticketStore.update({ ...tk, estado: 'Medida Implementada' })
                    await historialStore.add({ ticketId: tk.id, evento: 'Mitigación creada', usuarioId: 1, usuarioNombre: 'Victor Jhosef Laura Acosta', detalles: `Mitigación ${created.codigo}: medida implementada`, fecha: created.fechaEjecucion || new Date().toISOString().split('T')[0] })
                }
            }
        }
        toast.add({ severity: 'success', summary: t('mitigacion.saveSuccess'), life: 3000 })
        router.push('/mitigation/list')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ isEdit ? t('mitigacion.editTitle') : t('mitigacion.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.code') }} *</label>
          <pv-input-text v-model="form.codigo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.status') }}</label>
          <pv-select v-model="form.estado" :options="['Pendiente','En Progreso','Implementado','Verificado','Cerrado']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.assessment') }}</label>
          <pv-select v-model="form.riskAssessmentId" :options="assessmentStore.assessments" option-label="codigo" option-value="id" size="small" style="width:100%" show-clear />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.ticket') }}</label>
          <pv-select v-model="form.ticketId" :options="ticketStore.tickets" option-label="id" option-value="id" size="small" style="width:100%" show-clear>
            <template #option="slotProps">
              <span>#{{ slotProps.option.id }} — {{ slotProps.option.sector }} ({{ slotProps.option.estado }})</span>
            </template>
          </pv-select>
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.responsable') }} *</label>
          <pv-input-text v-model="form.responsable" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('mitigacion.description') }} *</label>
          <pv-textarea v-model="form.descripcion" size="small" style="width:100%" rows="3" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.assignedDate') }}</label>
          <pv-input-text v-model="form.fechaAsignacion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.executionDate') }}</label>
          <pv-input-text v-model="form.fechaEjecucion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('mitigacion.result') }}</label>
          <pv-select v-model="form.resultado" :options="['','Aprobado','Rechazado']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('mitigacion.observations') }}</label>
          <pv-textarea v-model="form.observaciones" size="small" style="width:100%" rows="2" />
        </div>
      </div>
    </div>
  </div>
</template>
