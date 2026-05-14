<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useActivoStore } from '@/activo/application/activo.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSedeStore } from '@/sede/application/sede.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useActivoStore()
const areaStore = useAreaStore()
const sedeStore = useSedeStore()

onMounted(() => {
    if (!store.loaded) store.fetchAll()
    if (!areaStore.loaded) areaStore.fetchAll()
    if (!sedeStore.loaded) sedeStore.fetchAll()
})

const areaName = (id) => areaStore.areas.find(a => a.id === id)?.nombre ?? '-'
const sedeName = (id) => sedeStore.sedes.find(s => s.id === id)?.nombre ?? '-'

const confirmDelete = (activo) => {
    confirm.require({
        message: t('activo.deleteConfirm'), header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(activo.id).then(() => toast.add({ severity: 'success', summary: t('activo.saveSuccess'), life: 3000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('activo.title') }}</span>
      <pv-button :label="t('activo.new')" icon="pi pi-plus" size="small" @click="router.push('/activo/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.activos" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="codigo" :header="t('activo.code')" style="width:110px" sortable />
        <pv-column field="nombre" :header="t('activo.name')" sortable />
        <pv-column field="tipo" :header="t('activo.type')" style="width:130px">
          <template #body="{ data }"><span class="rg-badge rg-badge-gray">{{ data.tipo }}</span></template>
        </pv-column>
        <pv-column :header="t('activo.area')" style="width:160px">
          <template #body="{ data }">{{ areaName(data.areaId) }}</template>
        </pv-column>
        <pv-column :header="t('activo.sede')" style="width:160px">
          <template #body="{ data }">{{ sedeName(data.sedeId) }}</template>
        </pv-column>
        <pv-column field="estado" :header="t('activo.status')" style="width:90px">
          <template #body="{ data }">
            <span :class="data.estado === 'Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'">{{ data.estado }}</span>
          </template>
        </pv-column>
        <pv-column field="ultimoMantenimiento" :header="t('activo.lastMaintenance')" style="width:160px" />
        <pv-column :header="t('common.actions')" style="width:110px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/activo/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/activo/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
