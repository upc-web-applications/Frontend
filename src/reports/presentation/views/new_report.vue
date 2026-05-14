<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const store = useReportsStore();
const toast = useToast();
const router = useRouter();

const reportType = ref('monthly');
const selectedMonth = ref(null);
const selectedYear = ref(null);
const selectedSector = ref(null);
const dateFrom = ref(null);
const dateTo = ref(null);
const reportFormat = ref('pdf');

const reportTypes = computed(() => [
  { label: t('my_reports.monthly'), value: 'monthly' },
  { label: t('my_reports.audit'), value: 'audit' },
  { label: t('my_reports.compliance'), value: 'compliance' }
]);

const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    label: new Date(2024, i).toLocaleString(locale.value, { month: 'long' }),
    value: i + 1
  }))
);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => ({
    label: currentYear - i,
    value: currentYear - i
  }));
});

const sectors = computed(() => [
  { label: t('new_report.all_sectors'), value: null },
  { label: 'Warehouse B', value: 'WAREHOUSE_B' },
  { label: 'Gas Plant', value: 'GAS_PLANT' },
  { label: 'Turbine 04', value: 'TURBINE_04' },
  { label: 'South Access', value: 'SOUTH_ACCESS' },
  { label: 'Control Room', value: 'CONTROL_ROOM' },
  { label: 'Warehouse C', value: 'WAREHOUSE_C' }
]);

const formats = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Excel', value: 'xlsx' }
];

const generateReport = async () => {
  try {
    if (reportType.value === 'monthly' && (!selectedMonth.value || !selectedYear.value)) {
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: t('validation.required'),
        life: 3000
      });
      return;
    }

    if (reportType.value === 'audit' && (!dateFrom.value || !dateTo.value)) {
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: t('errors.date_invalid'),
        life: 3000
      });
      return;
    }

    const reportData = {
      type: reportType.value,
      month: selectedMonth.value,
      year: selectedYear.value,
      start_date: dateFrom.value,
      end_date: dateTo.value,
      sector_filter: selectedSector.value,
      format: reportFormat.value,
      generation_date: new Date().toISOString(),
      file_name: `RiskGuard_${reportType.value}_${Date.now()}.${reportFormat.value}`,
      status: 'generated',
      size_kb: Math.floor(Math.random() * 5000) + 500
    };

    await store.createGeneratedReport(reportData);

    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('success.report_generated'),
      life: 3000
    });

    reportType.value = 'monthly';
    selectedMonth.value = null;
    selectedYear.value = null;
    selectedSector.value = null;
    dateFrom.value = null;
    dateTo.value = null;
    reportFormat.value = 'pdf';

  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: error.message,
      life: 3000
    });
    console.error(error);
  }
};
</script>

<template>
  <div class="new-report-container">

    <!-- HEADER -->
    <div class="page-header">
      <h1 class="page-title">{{ t('new_report.title') }}</h1>
    </div>

    <!-- FORM -->
    <div class="form-wrapper">

      <!-- REPORT TYPE SELECTOR -->
      <div class="form-section">
        <h2 class="section-title">{{ t('my_reports.report_type') }}</h2>
        <pv-select-button
            v-model="reportType"
            :options="reportTypes"
            option-label="label"
            option-value="value"
            class="w-full"
        />
      </div>

      <!-- MONTHLY -->
      <div v-if="reportType === 'monthly'" class="form-section">
        <h3 class="section-title">{{ t('new_report.monthly_section') }}</h3>

        <div class="form-grid">

          <div class="field">
            <label class="field-label">{{ t('new_report.select_month') }}</label>
            <pv-select
                v-model="selectedMonth"
                :options="months"
                option-label="label"
                option-value="value"
                :placeholder="t('new_report.select_month')"
                class="w-full"
            />
          </div>

          <div class="field">
            <label class="field-label">{{ t('new_report.select_year') }}</label>
            <pv-select
                v-model="selectedYear"
                :options="years"
                option-label="label"
                option-value="value"
                :placeholder="t('new_report.select_year')"
                class="w-full"
            />
          </div>

        </div>
      </div>

      <!-- AUDIT (SUNAFIL) -->
      <div v-if="reportType === 'audit'" class="form-section">
        <h3 class="section-title">{{ t('new_report.sunafil_section') }}</h3>

        <div class="form-grid">

          <div class="field">
            <label class="field-label">{{ t('new_report.date_from') }}</label>
            <pv-calendar
                v-model="dateFrom"
                date-format="dd/mm/yy"
                show-icon
                class="w-full"
            />
          </div>

          <div class="field">
            <label class="field-label">{{ t('new_report.date_to') }}</label>
            <pv-calendar
                v-model="dateTo"
                date-format="dd/mm/yy"
                show-icon
                class="w-full"
            />
          </div>

        </div>
      </div>

      <!-- COMPLIANCE -->
      <div v-if="reportType === 'compliance'" class="form-section">
        <h3 class="section-title">{{ t('new_report.compliance_section') }}</h3>

        <div class="field">
          <label class="field-label">{{ t('new_report.sector') }}</label>
          <pv-select
              v-model="selectedSector"
              :options="sectors"
              option-label="label"
              option-value="value"
              :placeholder="t('new_report.all_sectors')"
              class="w-full"
          />
        </div>
      </div>

      <!-- FORMAT -->
      <div class="form-section">
        <h3 class="section-title">{{ t('new_report.format') }}</h3>
        <div class="field">
          <pv-select
              v-model="reportFormat"
              :options="formats"
              option-label="label"
              option-value="value"
              class="w-full"
          />
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="form-actions">
        <pv-button
            :label="t('new_report.generate')"
            icon="pi pi-check"
            severity="warning"
            @click="generateReport"
        />
        <pv-button
            :label="t('common.cancel')"
            icon="pi pi-times"
            severity="secondary"
            @click="router.push('/reportes/list')"
        />
      </div>

    </div>

    <!-- LOADING -->
    <div v-if="store.isLoading" class="loading-state">
      <pv-spinner />
    </div>

  </div>
</template>

<style scoped>
.new-report-container {
  padding: 30px;
  background-color: var(--dark-bg);
  color: var(--text-color);
  min-height: 100%;
}

.page-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 20px;
}

.form-wrapper {
  max-width: 800px;
}

.form-section {
  background: linear-gradient(135deg, #1a1e24 0%, #0f1115 100%);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}

:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-calendar),
:deep(.p-selectbutton) {
  width: 100%;
}

:deep(.p-select),
:deep(.p-calendar) {
  background-color: #111418;
  border: 1px solid var(--border-color);
}

:deep(.p-select-label),
:deep(.p-inputtext) {
  color: var(--text-color);
}

@media (max-width: 768px) {
  .new-report-container { padding: 15px; }
  .page-title { font-size: 22px; }
  .form-grid { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
}
</style>
