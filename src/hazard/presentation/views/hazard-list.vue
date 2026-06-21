<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useHazardStore } from '@/hazard/application/hazard.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useHazardStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const riskClass = (n) => ({ 'Bajo':'rg-badge rg-badge-green','Medio':'rg-badge rg-badge-amber','Alto':'rg-badge rg-badge-red','Crítico':'rg-badge rg-badge-red' }[n] ?? 'rg-badge rg-badge-gray')

const confirmDelete = (hazard) => {
    confirm.require({
        message: t('peligro.deleteConfirm'), header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(hazard.id).then(() => toast.add({ severity: 'success', summary: t('peligro.deleteSuccess'), life: 3000 })).catch(() => toast.add({ severity: 'error', summary: t('common.error'), detail: t('peligro.deleteError'), life: 5000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('peligro.title') }}</span>
      <pv-button :label="t('peligro.new')" icon="pi pi-plus" size="small" @click="router.push('/hazard/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.hazards" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="codigo" :header="t('peligro.code')" style="width:110px" sortable />
        <pv-column field="nombre" :header="t('peligro.name')" sortable />
        <pv-column field="tipo" :header="t('peligro.type')" style="width:130px">
          <template #body="{ data }"><span class="rg-badge rg-badge-orange">{{ data.tipo }}</span></template>
        </pv-column>
        <pv-column field="nivelRiesgoBase" :header="t('peligro.baseRisk')" style="width:120px">
          <template #body="{ data }"><span :class="riskClass(data.nivelRiesgoBase)">{{ data.nivelRiesgoBase }}</span></template>
        </pv-column>
        <pv-column field="estado" :header="t('peligro.status')" style="width:90px">
          <template #body="{ data }"><span :class="data.estado==='Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:110px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/hazard/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/hazard/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
