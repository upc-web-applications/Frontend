<script setup>
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useRiskAssessmentStore } from '@/risk-assessment/application/risk-assessment.store.js'

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()
const store = useRiskAssessmentStore()

onMounted(() => { if (!store.loaded) store.fetchAll() })

const riskClass = (n) => ({ 'Bajo':'rg-badge rg-badge-green','Medio':'rg-badge rg-badge-amber','Alto':'rg-badge rg-badge-red','Critico':'rg-badge rg-badge-red' }[n] ?? 'rg-badge rg-badge-gray')

const confirmDelete = (assessment) => {
    confirm.require({
        message: t('evaluacionRiesgo.deleteConfirm'), header: t('common.confirm'), icon: 'pi pi-exclamation-triangle', acceptClass: 'p-button-danger',
        accept: () => store.remove(assessment.id).then(() => toast.add({ severity: 'success', summary: t('evaluacionRiesgo.deleteSuccess'), life: 3000 })).catch(() => toast.add({ severity: 'error', summary: t('common.error'), detail: t('evaluacionRiesgo.deleteError'), life: 5000 }))
    })
}
</script>

<template>
  <div>
    <div class="rg-page-header">
      <span class="rg-page-title">{{ t('evaluacionRiesgo.title') }}</span>
      <pv-button :label="t('evaluacionRiesgo.new')" icon="pi pi-plus" size="small" @click="router.push('/risk-assessment/new')" />
    </div>
    <div class="rg-table-wrap">
      <pv-data-table :value="store.assessments" :loading="!store.loaded" striped-rows size="small" :rows="10" paginator>
        <pv-column field="codigo" :header="t('evaluacionRiesgo.code')" style="width:130px" sortable />
        <pv-column field="sector" :header="t('evaluacionRiesgo.sector')" style="width:140px" sortable />
        <pv-column field="tipoPeligro" :header="t('evaluacionRiesgo.hazardType')" style="width:130px" sortable />
        <pv-column field="nivelRiesgo" :header="t('evaluacionRiesgo.riskLevel')" style="width:120px">
          <template #body="{ data }"><span :class="riskClass(data.nivelRiesgo)">{{ data.nivelRiesgo }}</span></template>
        </pv-column>
        <pv-column field="probabilidad" :header="t('evaluacionRiesgo.probability')" style="width:100px" />
        <pv-column field="severidad" :header="t('evaluacionRiesgo.severity')" style="width:90px" />
        <pv-column field="estado" :header="t('evaluacionRiesgo.status')" style="width:110px">
          <template #body="{ data }">
            <span :class="{'rg-badge rg-badge-green': data.estado==='Evaluado','rg-badge rg-badge-amber': data.estado==='En Evaluacion','rg-badge rg-badge-gray': data.estado==='Pendiente','rg-badge rg-badge-purple': data.estado==='Cerrado'}">{{ data.estado }}</span>
          </template>
        </pv-column>
        <pv-column field="fechaEvaluacion" :header="t('evaluacionRiesgo.date')" style="width:120px" />
        <pv-column :header="t('common.actions')" style="width:110px">
          <template #body="{ data }">
            <pv-button icon="pi pi-eye" size="small" text rounded @click="router.push(`/risk-assessment/${data.id}`)" />
            <pv-button icon="pi pi-pencil" size="small" text rounded severity="secondary" @click="router.push(`/risk-assessment/${data.id}/edit`)" />
            <pv-button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
