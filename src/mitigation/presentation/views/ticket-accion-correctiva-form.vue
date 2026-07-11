<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'
import { useHistorialTicketStore } from '@/mitigation/application/historial-ticket.store.js'
import { useTecnicoStore } from '@/technician/application/tecnico.store.js'
import { useInspectionStore } from '@/inspection/application/inspection.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useTicketAccionCorrectivaStore()
const historialStore = useHistorialTicketStore()
const tecnicoStore = useTecnicoStore()
const inspectionStore = useInspectionStore()
const areaStore = useAreaStore()
const identityStore = useIdentityAccessStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const errorMsg = ref('')
const ticketStatuses = ['Asignado', 'En ejecucion', 'Mitigacion reportada', 'En verificacion', 'Cerrado', 'Reabierto']
const form = ref({ reporteId: route.query.reporteId ? parseInt(route.query.reporteId) : null, sectorId: null, sector: '', tipoRiesgo: '', nivelCriticidad: '', estado: 'Asignado', instrucciones: '', tecnicoAsignadoId: null, tecnicoNombre: '', fechaCreacion: new Date().toISOString().split('T')[0], fechaCierre: '', slaLimiteHoras: 24, slaIncumplido: false })

onMounted(async () => {
    if (!tecnicoStore.loaded) await tecnicoStore.fetchAll()
    if (!historialStore.loaded) await historialStore.fetchAll()
    if (!inspectionStore.loaded) await inspectionStore.fetchAll()
    if (!areaStore.loaded) await areaStore.fetchAll()
    if (isEdit.value) {
        if (!store.loaded) await store.fetchAll()
        const e = store.getById(route.params.id)
        if (e) Object.assign(form.value, { ...e })
    } else if (form.value.reporteId) {
        prefillFromReport(form.value.reporteId)
    }
})

function areaName(id) {
    return areaStore.getById(id)?.nombre || ''
}

function slaByUrgency(urgency) {
    return ({ Alto: 4, Medio: 24, Bajo: 72 }[urgency] ?? 24)
}

function criticalityByUrgency(urgency) {
    return ({ Alto: 'Critico', Medio: 'Moderado', Bajo: 'Tolerable' }[urgency] ?? 'Moderado')
}

function prefillFromReport(reportId) {
    const report = inspectionStore.getById(reportId)
    if (!report) return
    form.value.reporteId = report.id
    form.value.sectorId = report.areaId
    form.value.sector = areaName(report.areaId) || `Area ${report.areaId || ''}`.trim()
    form.value.tipoRiesgo = report.tipoIncidente
    form.value.nivelCriticidad = criticalityByUrgency(report.nivelUrgencia)
    form.value.slaLimiteHoras = report.slaSugeridoHoras || slaByUrgency(report.nivelUrgencia)
    form.value.instrucciones = report.descripcion
}

const submit = async () => {
    errorMsg.value = ''
    if (!form.value.tecnicoAsignadoId) {
        errorMsg.value = 'Debe asignar un tecnico para crear el ticket correctivo.'
        return
    }
    if (form.value.tecnicoAsignadoId) {
        const t = tecnicoStore.getById(form.value.tecnicoAsignadoId)
        form.value.tecnicoNombre = t ? t.nombreCompleto : ''
        if (!form.value.estado) form.value.estado = 'Asignado'
    }
    saving.value = true
    try {
        if (isEdit.value) {
            const updated = await store.update({ ...form.value, id: route.params.id })
            if (updated) {
                await historialStore.add({ ticketId: updated.id, evento: 'Ticket actualizado', usuarioId: identityStore.currentUser?.id || 1, usuarioNombre: identityStore.currentUser?.name || 'Usuario', detalles: `Estado cambiado a: ${updated.estado}`, fecha: new Date().toISOString().split('T')[0] })
            }
        } else {
            const created = await store.add({ ...form.value })
            if (created && created.id) {
                await historialStore.add({ ticketId: created.id, evento: 'Ticket creado', usuarioId: identityStore.currentUser?.id || 1, usuarioNombre: identityStore.currentUser?.name || 'Usuario', detalles: `Ticket creado para ${created.sector || 'sector asignado'}`, fecha: created.fechaCreacion || new Date().toISOString().split('T')[0] })
                if (created.reporteId) {
                    const report = inspectionStore.getById(created.reporteId)
                    if (report) await inspectionStore.update({ ...report, estado: 'Convertido a ticket', accionCorrectiva: `Ticket #${created.ticketNumber || created.id}` })
                }
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
    <div v-if="errorMsg" style="background:rgba(226,75,74,0.12);color:var(--rg-red);padding:8px 12px;border-radius:6px;margin-bottom:12px;font-size:0.82rem">{{ errorMsg }}</div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div v-if="form.reporteId" class="rg-form-field full">
          <label class="rg-label">{{ t('ticketCorrectivo.fromReport') }}</label>
          <div style="color:var(--rg-text-muted);font-size:0.85rem">Reporte #{{ form.reporteId }} convertido en orden de trabajo correctivo.</div>
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.riskType') }} *</label>
          <pv-input-text v-model="form.tipoRiesgo" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.criticality') }}</label>
          <pv-select v-model="form.nivelCriticidad" :options="['Tolerable','Moderado','Importante','Critico']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('ticketCorrectivo.sector') }} *</label>
          <pv-input-text v-model="form.sector" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('common.status') }}</label>
          <pv-select v-model="form.estado" :options="ticketStatuses" size="small" style="width:100%" />
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
