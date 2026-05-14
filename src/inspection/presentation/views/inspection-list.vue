<script setup>
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useInspectionStore } from '@/inspection/application/inspection.store.js'
import { useAreaStore } from '@/area/application/area.store.js'
import { useSiteStore } from '@/site/application/site.store.js'

const { t } = useI18n(); const router = useRouter(); const confirm = useConfirm(); const toast = useToast()
const store = useInspectionStore(); const areaStore = useAreaStore(); const siteStore = useSiteStore()

onMounted(() => {
    if (!store.loaded) store.fetchAll()
    if (!areaStore.loaded) areaStore.fetchAll()
    if (!siteStore.loaded) siteStore.fetchAll()
})

const pendientes  = computed(() => store.inspections.filter(i => i.estado === 'Pendiente').length)
const enProgreso  = computed(() => store.inspections.filter(i => i.estado === 'En Progreso').length)
const resueltos   = computed(() => store.inspections.filter(i => i.estado === 'Resuelto').length)

const areaName = (id) => areaStore.areas.find(a => a.id === id)?.nombre ?? '-'
const urgClass = (u) => ({ 'Alto':'rg-badge rg-badge-red','Medio':'rg-badge rg-badge-amber','Bajo':'rg-badge rg-badge-green' }[u] ?? 'rg-badge rg-badge-gray')
const statClass = (s) => ({ 'Pendiente':'rg-badge rg-badge-amber','En Progreso':'rg-badge rg-badge-orange','Resuelto':'rg-badge rg-badge-green' }[s] ?? 'rg-badge rg-badge-gray')
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-'

const confirmDelete = (ins) => {
    confirm.require({
        message: t('inspeccion.deleteConfirm'), header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(ins.id).then(() => toast.add({ severity: 'success', summary: 'Inspección eliminada', life: 3000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('inspeccion.title') }}</span>
      <pv-button :label="t('inspeccion.new')" icon="pi pi-plus" size="small" @click="router.push('/inspection/new')" />
    </div>

    <div class="rg-stats-row">
      <div class="rg-stat-card">
        <div class="rg-stat-num" style="color:var(--rg-amber)">{{ pendientes }}</div>
        <div><div class="rg-stat-lbl">Pendientes</div></div>
      </div>
      <div class="rg-stat-card">
        <div class="rg-stat-num" style="color:var(--rg-primary)">{{ enProgreso }}</div>
        <div><div class="rg-stat-lbl">En Progreso</div></div>
      </div>
      <div class="rg-stat-card">
        <div class="rg-stat-num" style="color:var(--rg-green)">{{ resueltos }}</div>
        <div><div class="rg-stat-lbl">Resueltos</div></div>
      </div>
    </div>

    <div class="rg-table-wrap">
      <pv-data-table :value="store.inspections" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="ticket" :header="t('inspeccion.ticket')" style="width:120px">
          <template #body="{ data }"><span style="font-family:'Syne',sans-serif;font-weight:700;color:var(--rg-primary)">{{ data.ticket }}</span></template>
        </pv-column>
        <pv-column field="tipoIncidente" :header="t('inspeccion.type')" sortable />
        <pv-column :header="t('inspeccion.area')" style="width:160px">
          <template #body="{ data }">{{ areaName(data.areaId) }}</template>
        </pv-column>
        <pv-column field="nivelUrgencia" :header="t('inspeccion.urgency')" style="width:100px">
          <template #body="{ data }"><span :class="urgClass(data.nivelUrgencia)">{{ data.nivelUrgencia }}</span></template>
        </pv-column>
        <pv-column field="estado" :header="t('inspeccion.status')" style="width:120px">
          <template #body="{ data }"><span :class="statClass(data.estado)">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column :header="t('inspeccion.reportDate')" style="width:160px">
          <template #body="{ data }">{{ fmtDate(data.fechaReporte) }}</template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:90px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/inspection/${data.id}`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
