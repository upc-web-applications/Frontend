<script setup>
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useSiteStore } from '@/site/application/site.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useSiteStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const badgeClass = (estado) => estado === 'Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'

const confirmDelete = (site) => {
    confirm.require({
        message: t('sede.deleteConfirm'), header: t('common.confirm'), icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => store.remove(site.id).then(() => toast.add({ severity: 'success', summary: t('sede.deleteSuccess'), life: 3000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('sede.title') }}</span>
      <pv-button :label="t('sede.new')" icon="pi pi-plus" size="small" @click="router.push('/site/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.sites" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="id" header="ID" style="width:60px" />
        <pv-column field="nombre" :header="t('sede.name')" sortable />
        <pv-column field="direccion" :header="t('sede.address')" />
        <pv-column field="telefono" :header="t('sede.phone')" style="width:140px" />
        <pv-column field="email" :header="t('sede.email')" />
        <pv-column field="estado" :header="t('sede.status')" style="width:100px">
          <template #body="{ data }">
            <span :class="badgeClass(data.estado)">{{ data.estado }}</span>
          </template>
        </pv-column>
        <pv-column field="fechaCreacion" :header="t('sede.createdAt')" style="width:130px" />
        <pv-column :header="t('common.actions')" style="width:120px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/site/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/site/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
