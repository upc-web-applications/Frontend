<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useVerificacionMedidaStore } from '@/mitigation/application/verificacion-medida.store.js'
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js'
import { useHistorialTicketStore } from '@/mitigation/application/historial-ticket.store.js'
import { useMitigationStore } from '@/mitigation/application/mitigation.store.js'
import { useNotificacionCriticaStore } from '@/mitigation/application/notificacion-critica.store.js'
import { useInspectionStore } from '@/inspection/application/inspection.store.js'
import { useAssetStore } from '@/organization-assets/asset/application/asset.store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useVerificacionMedidaStore()
const ticketStore = useTicketAccionCorrectivaStore()
const historialStore = useHistorialTicketStore()
const mitigationStore = useMitigationStore()
const notifStore = useNotificacionCriticaStore()
const inspectionStore = useInspectionStore()
const assetStore = useAssetStore()

const saving = ref(false)
const errorMsg = ref('')
const form = ref({ ticketId: route.query.ticketId ? parseInt(route.query.ticketId) : null, supervisorId: null, supervisorNombre: '', veredicto: '', comentarioJustificacion: '', fechaVerificacion: new Date().toISOString().split('T')[0] })

const selectedTicket = computed(() => form.value.ticketId ? ticketStore.getById(form.value.ticketId) : null)

onMounted(() => {
    if (!ticketStore.loaded) ticketStore.fetchAll()
    if (!mitigationStore.loaded) mitigationStore.fetchAll()
    if (!inspectionStore.loaded) inspectionStore.fetchAll()
    if (!assetStore.loaded) assetStore.fetchAll()
})

async function reactivateLinkedAsset(ticket) {
    if (!ticket?.reporteId) return
    const report = inspectionStore.getById(ticket.reporteId)
    if (!report?.activoId) return
    const asset = assetStore.getById(report.activoId)
    if (asset) await assetStore.update({ ...asset, estado: 'Activo' })
}

const submit = async () => {
    errorMsg.value = ''
    if (!form.value.ticketId) { errorMsg.value = 'Debe seleccionar un ticket'; return }
    if (!form.value.veredicto) { errorMsg.value = 'Debe seleccionar un veredicto'; return }
    const exists = ticketStore.getById(form.value.ticketId)
    if (!exists) { errorMsg.value = 'El ticket seleccionado no existe'; return }

    saving.value = true
    try {
        const created = await store.add(form.value)
        const tk = ticketStore.getById(form.value.ticketId)
        const hoy = new Date().toISOString().split('T')[0]

        if (created && created.veredicto === 'Aprobado' && tk) {
            await ticketStore.update({ ...tk, estado: 'Cerrado', fechaCierre: hoy })
            await historialStore.add({ ticketId: tk.id, evento: 'Ticket cerrado', usuarioId: 1, usuarioNombre: form.value.supervisorNombre || 'Supervisor', detalles: `Mitigacion aprobada: ${form.value.comentarioJustificacion || 'Sin comentarios'}`, fecha: hoy })
            const mit = mitigationStore.getByTicketId(tk.id)
            if (mit) await mitigationStore.update({ ...mit, estado: 'Cerrado', resultado: 'Aprobado', fechaEjecucion: hoy })
            await reactivateLinkedAsset(tk)
            toast.add({ severity: 'success', summary: 'Ticket cerrado y mitigacion aprobada', life: 3000 })
        } else if (created && created.veredicto === 'Rechazado' && tk) {
            await ticketStore.update({ ...tk, estado: 'Reabierto' })
            await historialStore.add({ ticketId: tk.id, evento: 'Ticket reabierto', usuarioId: 1, usuarioNombre: form.value.supervisorNombre || 'Supervisor', detalles: `Mitigacion rechazada: ${form.value.comentarioJustificacion || 'Sin comentarios'}`, fecha: hoy })
            await notifStore.add({ ticketId: tk.id, supervisorId: 1, supervisorNombre: form.value.supervisorNombre || 'Supervisor', mensaje: `Ticket #${tk.id} reabierto - mitigacion rechazada en ${tk.sector}`, enviada: true, fechaEnvio: hoy })
            const mit = mitigationStore.getByTicketId(tk.id)
            if (mit) await mitigationStore.update({ ...mit, resultado: 'Rechazado', observaciones: form.value.comentarioJustificacion })
            toast.add({ severity: 'warn', summary: 'Ticket escalado por rechazo', life: 3000 })
        }

        toast.add({ severity: 'success', summary: t('verificacion.saveSuccess'), life: 3000 })
        router.push('/mitigation/verificaciones')
    } finally { saving.value = false }
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <div style="display:flex;align-items:center;gap:8px">
        <pv-button icon="pi pi-arrow-left" text rounded size="small" @click="router.back()" />
        <span class="rg-page-title">{{ t('verificacion.newTitle') }}</span>
      </div>
      <pv-button :label="t('common.save')" icon="pi pi-check" size="small" :loading="saving" @click="submit" />
    </div>
    <div v-if="errorMsg" style="background:rgba(226,75,74,0.12);color:var(--rg-red);padding:8px 12px;border-radius:6px;margin-bottom:12px;font-size:0.82rem">{{ errorMsg }}</div>
    <div class="rg-card">
      <div class="rg-form-grid">
        <div class="rg-form-field">
          <label class="rg-label">{{ t('verificacion.ticket') }} *</label>
          <pv-select v-model="form.ticketId" :options="ticketStore.tickets" option-label="id" option-value="id" size="small" style="width:100%" :placeholder="t('ticketCorrectivo.selectTechnician')">
            <template #option="slotProps">
              <span>#{{ slotProps.option.id }} - {{ slotProps.option.sector }} [{{ slotProps.option.estado }}]</span>
            </template>
          </pv-select>
          <div v-if="selectedTicket" style="font-size:0.7rem;color:var(--rg-text-muted);margin-top:4px">{{ t('evaluacionRiesgo.sector') }}: {{ selectedTicket.sector }} | {{ t('common.status') }}: {{ selectedTicket.estado }}</div>
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('verificacion.supervisor') }}</label>
          <pv-input-text v-model="form.supervisorNombre" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('verificacion.veredict') }} *</label>
          <pv-select v-model="form.veredicto" :options="['Aprobado','Rechazado']" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field">
          <label class="rg-label">{{ t('verificacion.date') }}</label>
          <pv-input-text v-model="form.fechaVerificacion" type="date" size="small" style="width:100%" />
        </div>
        <div class="rg-form-field full">
          <label class="rg-label">{{ t('verificacion.comment') }}</label>
          <pv-textarea v-model="form.comentarioJustificacion" size="small" style="width:100%" rows="3" />
        </div>
      </div>
    </div>
  </div>
</template>
