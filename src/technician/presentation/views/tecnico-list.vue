<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useTecnicoStore } from '@/technician/application/tecnico.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useTecnicoStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const estadoClass = (e) => e === 'Activo' ? 'rg-badge rg-badge-green' : 'rg-badge rg-badge-gray'

const confirmDelete = (tecnico) => {
    confirm.require({
        message: '¿Eliminar este técnico?', header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(tecnico.id).then(() => toast.add({ severity: 'success', summary: 'Técnico eliminado', life: 3000 })).catch(() => toast.add({ severity: 'error', summary: t('common.error'), detail: 'No se pudo eliminar el técnico', life: 5000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('tecnico.title') }}</span>
      <pv-button :label="t('tecnico.new')" icon="pi pi-plus" size="small" @click="router.push('/technician/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.tecnicos" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="numeroDocumento" :header="t('tecnico.document')" style="width:120px" sortable />
        <pv-column field="nombreCompleto" :header="t('tecnico.fullName')" style="width:200px" sortable />
        <pv-column field="especialidad" :header="t('tecnico.specialty')" style="width:140px" />
        <pv-column field="telefono" :header="t('tecnico.phone')" style="width:130px" />
        <pv-column field="email" :header="t('tecnico.email')" style="width:180px" />
        <pv-column field="estado" :header="t('common.status')" style="width:80px">
          <template #body="{ data }"><span :class="estadoClass(data.estado)">{{ data.estado }}</span></template>
        </pv-column>
        <pv-column :header="t('common.actions')" style="width:110px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/technician/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/technician/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
