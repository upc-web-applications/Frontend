<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import {
  generateMonthlyPDF,
  generateAuditPDF,
  generateCompliancePDF,
  downloadPDF,
  pdfToBlob
} from '@/reports/infrastructure/pdf-report.service.js';
import {
  generateMonthlyExcel,
  generateAuditExcel,
  generateComplianceExcel
} from '@/reports/infrastructure/excel-report.service.js';

const { t, locale } = useI18n();
const store = useReportsStore();
const toast = useToast();
const router = useRouter();

// Preview state
const showPreview = ref(false);
const previewUrl  = ref(null);
const previewName = ref('');

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

const formats = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Excel', value: 'xlsx' }
];

onMounted(async () => {
  await Promise.all([
    store.fetchOperationalData(),
    store.fetchAnnualOHSPlan()
  ]);
});

const reportIncidents = computed(() =>
  store.operationalTickets.map(ticket => ({
    id: ticket.id,
    date: ticket.createdAt,
    section: ticket.sector,
    sector: ticket.sector,
    incident_type: ticket.riskType,
    resolved: ticket.status?.toLowerCase?.().includes('cerrado') || false,
    resolution_time_hours: ticket.elapsedHours
  }))
);

const sectors = computed(() => {
  const sectorNames = new Set([
    ...(store.annualOHSPlan?.details_by_sector || []).map(sector => sector.sector),
    ...store.operationalTickets.map(ticket => ticket.sector)
  ].filter(Boolean));

  return [
    { label: t('new_report.all_sectors'), value: null },
    ...Array.from(sectorNames)
      .sort((a, b) => a.localeCompare(b))
      .map(sector => ({ label: sector, value: sector }))
  ];
});

const isParcial = computed(() => {
  if (reportType.value !== 'monthly' || !selectedMonth.value) return false;
  const now = new Date();
  const yr = selectedYear.value || now.getFullYear();
  return yr === now.getFullYear() && selectedMonth.value === now.getMonth() + 1;
});

const generateReport = async () => {
  try {
    if (reportType.value === 'monthly' && (!selectedMonth.value || !selectedYear.value)) {
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('validation.required'), life: 3000 });
      return;
    }
    if (reportType.value === 'audit' && (!dateFrom.value || !dateTo.value)) {
      toast.add({ severity: 'error', summary: t('common.error'), detail: t('errors.date_invalid'), life: 3000 });
      return;
    }

    // Ensure data is loaded
    await Promise.all([
      store.fetchOperationalData(),
      store.fetchKPIDashboard(),
      store.fetchAnnualOHSPlan()
    ]);

    const month = selectedMonth.value;
    const year  = selectedYear.value || new Date().getFullYear();
    const monthName = month
        ? new Date(year, month - 1).toLocaleString(locale.value, { month: 'long' })
        : '';
    const isExcel = reportFormat.value === 'xlsx';

    let fileName = '';

    if (isExcel) {
      // -- EXCEL ------------------------------------------
      if (reportType.value === 'monthly') {
        fileName = generateMonthlyExcel({
          month, year, incidents: reportIncidents.value,
          kpiDashboard: store.kpiDashboard, annualOHSPlan: store.annualOHSPlan,
          locale: locale.value
        });
      } else if (reportType.value === 'audit') {
        fileName = generateAuditExcel({
          dateFrom: dateFrom.value, dateTo: dateTo.value,
          incidents: reportIncidents.value, annualOHSPlan: store.annualOHSPlan
        });
      } else {
        fileName = generateComplianceExcel({
          sectorFilter: selectedSector.value, annualOHSPlan: store.annualOHSPlan,
          kpiDashboard: store.kpiDashboard, incidents: reportIncidents.value
        });
      }

      await store.createGeneratedReport({
        type: reportType.value, month, year,
        start_date: dateFrom.value, end_date: dateTo.value,
        sector_filter: selectedSector.value, format: 'xlsx',
        generation_date: new Date().toISOString(),
        file_name: fileName, status: 'generated', size_kb: 0
      });

      toast.add({ severity: 'success', summary: t('common.success'), detail: t('success.report_generated'), life: 3000 });

    } else {
      // -- PDF --------------------------------------------
      let doc = null;

      if (reportType.value === 'monthly') {
        doc = generateMonthlyPDF({
          month, year, incidents: reportIncidents.value,
          kpiDashboard: store.kpiDashboard, annualOHSPlan: store.annualOHSPlan,
          locale: locale.value
        });
        fileName = `RiskGuard_Reporte_Mensual_${monthName}_${year}.pdf`;
      } else if (reportType.value === 'audit') {
        doc = generateAuditPDF({
          dateFrom: dateFrom.value, dateTo: dateTo.value,
          incidents: reportIncidents.value, annualOHSPlan: store.annualOHSPlan
        });
        const from = new Date(dateFrom.value).toLocaleDateString('es-PE').replace(/\//g, '-');
        const to   = new Date(dateTo.value).toLocaleDateString('es-PE').replace(/\//g, '-');
        fileName = `RiskGuard_Auditoria_${from}_${to}.pdf`;
      } else {
        doc = generateCompliancePDF({
          sectorFilter: selectedSector.value, annualOHSPlan: store.annualOHSPlan,
          kpiDashboard: store.kpiDashboard, incidents: reportIncidents.value
        });
        const sectorPart = selectedSector.value || 'todos';
        fileName = `RiskGuard_Cumplimiento_${sectorPart}_${new Date().toISOString().slice(0,10)}.pdf`;
      }

      const blob = pdfToBlob(doc);
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
      previewUrl.value  = URL.createObjectURL(blob);
      previewName.value = fileName;

      await store.createGeneratedReport({
        type: reportType.value, month, year,
        start_date: dateFrom.value, end_date: dateTo.value,
        sector_filter: selectedSector.value, format: 'pdf',
        generation_date: new Date().toISOString(),
        file_name: fileName, status: 'generated',
        size_kb: Math.round(blob.size / 1024)
      });

      downloadPDF(doc, fileName);
      toast.add({ severity: 'success', summary: t('common.success'), detail: t('success.report_generated'), life: 3000 });
      showPreview.value = true;
    }

  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error.message, life: 3000 });
  }
};

const closePreview = () => {
  showPreview.value = false;
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
        <pv-select
            v-model="reportType"
            :options="reportTypes"
            option-label="label"
            option-value="value"
            :placeholder="t('my_reports.report_type')"
            class="w-full"
        />
      </div>

      <!-- PARTIAL PERIOD NOTICE -->
      <div v-if="isParcial" class="partial-notice">
        <i class="pi pi-info-circle"></i>
        <span>{{ t('new_report.partial_period_notice') }}</span>
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
    <div v-if="store.loadingGeneratedReports" class="loading-state">
      <pv-spinner />
    </div>

  </div>

  <!-- PDF PREVIEW DIALOG -->
  <pv-dialog
      v-model:visible="showPreview"
      :header="previewName"
      :modal="true"
      :draggable="false"
      style="width: 80vw; max-width: 1000px;"
      @hide="closePreview"
  >
    <iframe
        v-if="previewUrl"
        :src="previewUrl"
        style="width:100%; height:70vh; border:none; border-radius:6px;"
        title="Vista previa del reporte"
    />
    <template #footer>
      <pv-button
          :label="t('common.close')"
          icon="pi pi-times"
          severity="secondary"
          @click="closePreview"
      />
      <pv-button
          :label="t('my_reports.download')"
          icon="pi pi-download"
          severity="warning"
          @click="() => { const a = document.createElement('a'); a.href = previewUrl; a.download = previewName; a.click(); }"
      />
    </template>
  </pv-dialog>
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

.partial-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 4px;
  font-size: 13px;
  color: #FCD34D;
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
