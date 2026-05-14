<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted, computed, ref } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const store = useReportsStore();
const confirm = useConfirm();
const toast = useToast();
const router = useRouter();

const selectedMonth = ref(null);
const selectedYear = ref(null);
const selectedType = ref(null);

const months = [
  { label: t('common.all'), value: null },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: new Date(2024, i).toLocaleString('es', { month: 'long' }),
    value: i + 1
  }))
];

const years = [
  { label: t('common.all'), value: null },
  ...Array.from({ length: 5 }, (_, i) => ({
    label: new Date().getFullYear() - i,
    value: new Date().getFullYear() - i
  }))
];

const types = [
  { label: t('common.all'), value: null },
  { label: t('my_reports.monthly'), value: 'monthly' },
  { label: t('my_reports.audit'), value: 'audit' },
  { label: t('my_reports.compliance'), value: 'compliance' }
];

onMounted(async () => {
  await store.fetchGeneratedReports();
});

const filteredReports = computed(() => {
  return store.generatedReports.filter(report => {
    if (selectedMonth.value && report.month !== selectedMonth.value) return false;
    if (selectedYear.value && report.year !== selectedYear.value) return false;
    if (selectedType.value && report.type !== selectedType.value) return false;
    return true;
  });
});

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE');
};

const formatSize = (sizeKb) => {
  if (!sizeKb && sizeKb !== 0) return '—';
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${sizeKb} KB`;
};

const downloadReport = (report) => {
  toast.add({
    severity: 'success',
    summary: t('common.success'),
    detail: t('success.report_downloaded'),
    life: 3000
  });
};

const deleteReport = (report) => {
  confirm.require({
    message: t('validation.confirm_delete'),
    header: t('common.confirm'),
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await store.deleteGeneratedReport(report.id);
        toast.add({
          severity: 'success',
          summary: t('common.success'),
          detail: t('success.data_deleted'),
          life: 3000
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: t('common.error'),
          detail: error.message,
          life: 3000
        });
      }
    }
  });
};

const resetFilters = () => {
  selectedMonth.value = null;
  selectedYear.value = null;
  selectedType.value = null;
};
</script>

<template>
  <div class="reports-list-container">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('my_reports.title') }}</h1>
        <p class="page-subtitle">{{ t('my_reports.subtitle') }}</p>
      </div>
      <pv-button
          icon="pi pi-plus"
          :label="t('new_report.title')"
          @click="router.push('/reportes/new')"
          severity="warning"
      />
    </div>

    <!-- FILTERS -->
    <div class="filters-section">
      <h3 class="section-title">{{ t('my_reports.filters') }}</h3>

      <div class="filter-grid">

        <div class="filter-item">
          <label class="filter-label">{{ t('my_reports.month') }}</label>
          <pv-select
              v-model="selectedMonth"
              :options="months"
              option-label="label"
              option-value="value"
              class="w-full"
              :show-clear="true"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">{{ t('my_reports.year') }}</label>
          <pv-select
              v-model="selectedYear"
              :options="years"
              option-label="label"
              option-value="value"
              class="w-full"
              :show-clear="true"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">{{ t('my_reports.type') }}</label>
          <pv-select
              v-model="selectedType"
              :options="types"
              option-label="label"
              option-value="value"
              class="w-full"
              :show-clear="true"
          />
        </div>

        <div class="filter-item filter-reset">
          <pv-button
              :label="t('common.reset')"
              icon="pi pi-refresh"
              severity="secondary"
              @click="resetFilters"
              class="w-full"
          />
        </div>

      </div>
    </div>

    <!-- TABLE -->
    <div class="table-section">

      <div v-if="store.isLoading" class="loading-state">
        <pv-spinner />
      </div>

      <div v-else-if="filteredReports.length === 0" class="empty-state">
        <i class="pi pi-inbox empty-icon"></i>
        <p>{{ t('my_reports.no_reports') }}</p>
      </div>

      <pv-data-table
          v-else
          :value="filteredReports"
          :paginator="true"
          :rows="10"
          responsive-layout="scroll"
      >

        <pv-column field="id" :header="t('my_reports.id')" style="width:12%" />

        <pv-column field="type" :header="t('my_reports.report_type')" style="width:15%">
          <template #body="{ data }">
            <pv-tag :value="t(`my_reports.${data.type}`) || data.type" severity="info" />
          </template>
        </pv-column>

        <pv-column :header="t('my_reports.date')" style="width:18%">
          <template #body="{ data }">
            {{ formatDate(data.generation_date) }}
          </template>
        </pv-column>

        <pv-column :header="t('common.status')" style="width:15%">
          <template #body="{ data }">
            <pv-tag
                :value="data.status"
                :severity="data.status === 'downloaded' ? 'success' : data.status === 'generated' ? 'info' : 'warning'"
            />
          </template>
        </pv-column>

        <pv-column :header="t('my_reports.size')" style="width:12%">
          <template #body="{ data }">
            {{ formatSize(data.size_kb) }}
          </template>
        </pv-column>

        <pv-column :header="t('my_reports.actions')" style="width:15%">
          <template #body="{ data }">
            <div class="actions">
              <pv-button
                  icon="pi pi-download"
                  rounded
                  severity="success"
                  @click="downloadReport(data)"
                  v-tooltip.top="t('my_reports.download')"
              />
              <pv-button
                  icon="pi pi-trash"
                  rounded
                  severity="danger"
                  @click="deleteReport(data)"
                  v-tooltip.top="t('common.delete')"
              />
            </div>
          </template>
        </pv-column>

      </pv-data-table>
    </div>

  </div>
</template>

<style scoped>
.reports-list-container {
  padding: 30px;
  background-color: var(--dark-bg);
  color: var(--text-color);
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 6px;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 16px;
}

.filters-section {
  background: var(--rg-bg-3);
  border: 1px solid var(--rg-border);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-reset {
  justify-content: flex-end;
}

.table-section {
  background: var(--rg-bg-3);
  border: 1px solid var(--rg-border);
  border-radius: 10px;
  overflow: hidden;
}

.actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .reports-list-container { padding: 15px; }
  .page-header { flex-direction: column; gap: 16px; }
  .page-title { font-size: 22px; }
  .filter-grid { grid-template-columns: 1fr; }
}
</style>
