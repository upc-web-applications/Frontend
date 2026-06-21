<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useMitigationStore } from '@/mitigation/application/mitigation.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useMitigationStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const statusClass = (s) => ({ 'Pendiente':'rg-badge rg-badge-gray','En Progreso':'rg-badge rg-badge-amber','Implementado':'rg-badge rg-badge-purple','Verificado':'rg-badge rg-badge-green','Cerrado':'rg-badge rg-badge-green' }[s] ?? 'rg-badge rg-badge-gray')
const resultClass = (r) => r === 'Aprobado' ? 'rg-badge rg-badge-green' : r === 'Rechazado' ? 'rg-badge rg-badge-red' : ''

const confirmDelete = (mit) => {
    confirm.require({
        message: t('mitigacion.deleteConfirm'), header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(mit.id).then(() => toast.add({ severity: 'success', summary: t('mitigacion.deleteSuccess'), life: 3000 })).catch(() => toast.add({ severity: 'error', summary: t('common.error'), detail: t('mitigacion.deleteError'), life: 5000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('mitigacion.title') }}</span>
      <pv-button :label="t('mitigacion.new')" icon="pi pi-plus" size="small" @click="router.push('/mitigation/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.mitigations" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="codigo" :header="t('mitigacion.code')" style="width:130px" sortable />
        <pv-column field="descripcion" :header="t('mitigacion.description')" style="min-width:200px">
          <template #body="{ data }">{{ data.descripcion.substring(0, 60) }}{{ data.descripcion.length > 60 ? '...' : '' }}</template>
        </pv-column>
        <pv-column field="responsable" :header="t('mitigacion.responsable')" style="width:150px" sortable />
        <pv-column field="estado" :header="t('mitigacion.status')" style="width:120px">
          <template #body="{ data }"><span :class="statusClass(data.estado)">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column field="resultado" :header="t('mitigacion.result')" style="width:110px">
          <template #body="{ data }"><span v-if="data.resultado" :class="resultClass(data.resultado)">{{ data.resultado }}</span><span v-else class="rg-badge rg-badge-gray">-</span></template>
        </pv-column>
        <pv-column field="fechaAsignacion" :header="t('mitigacion.assignedDate')" style="width:120px" />
        <pv-column :header="t('common.actions')" style="width:110px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/mitigation/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/mitigation/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
