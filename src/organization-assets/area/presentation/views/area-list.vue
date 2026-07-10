<script setup>
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useAreaStore } from '@/organization-assets/area/application/area.store.js'
import { useSiteStore } from '@/organization-assets/site/application/site.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useAreaStore()
const siteStore = useSiteStore()

onMounted(() => { if (!store.loaded) store.fetchAll(); if (!siteStore.loaded) siteStore.fetchAll() })

const siteName = (id) => siteStore.sites.find(s => s.id === id)?.nombre ?? '-'
const riskClass = (n) => ({ 'Bajo':'rg-badge rg-badge-green','Medio':'rg-badge rg-badge-amber','Alto':'rg-badge rg-badge-red','Critico':'rg-badge rg-badge-red' }[n] ?? 'rg-badge rg-badge-gray')

const confirmDelete = (area) => {
    confirm.require({
        message: t('area.deleteConfirm'), header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(area.id).then(() => toast.add({ severity: 'success', summary: t('area.saveSuccess'), life: 3000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('area.title') }}</span>
      <pv-button :label="t('area.new')" icon="pi pi-plus" size="small" @click="router.push('/organization-assets/area/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.areas" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="codigo" :header="t('area.code')" style="width:110px" sortable />
        <pv-column field="nombre" :header="t('area.name')" sortable />
        <pv-column :header="t('area.sede')" style="width:180px">
          <template #body="{ data }">{{ siteName(data.sedeId) }}</template>
        </pv-column>
        <pv-column field="nivelRiesgo" :header="t('area.riskLevel')" style="width:120px">
          <template #body="{ data }"><span :class="riskClass(data.nivelRiesgo)">{{ data.nivelRiesgo }}</span></template>
        </pv-column>
        <pv-column field="estado" :header="t('area.status')" style="width:90px">
          <template #body="{ data }"><span :class="data.estado==='Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:110px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/organization-assets/area/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/organization-assets/area/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
