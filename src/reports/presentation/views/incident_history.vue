<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted, computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { t } = useI18n();
const store = useReportsStore();
const toast = useToast();

const filterSector   = ref(null);
const filterType     = ref(null);
const filterStatus   = ref(null);
const filterDateFrom = ref(null);
const filterDateTo   = ref(null);

onMounted(async () => {
  await store.fetchIncidents();
});

const sectorOptions = computed(() => {
  const all = [{ label: t('common.all'), value: null }];
  const set = new Set(store.incidents.map(i => i.section || i.sector).filter(Boolean));
  return [...all, ...[...set].map(s => ({ label: s, value: s }))];
});

const typeOptions = computed(() => {
  const all = [{ label: t('common.all'), value: null }];
  const set = new Set(store.incidents.map(i => i.incident_type).filter(Boolean));
  return [...all, ...[...set].map(s => ({ label: s, value: s }))];
});

const statusOptions = [
  { label: t('common.all'),      value: null },
  { label: t('notifications.resolved'),   value: true },
  { label: t('notifications.unresolved'), value: false }
];

const filteredIncidents = computed(() => {
  return store.incidents.filter(i => {
    if (filterSector.value && (i.section || i.sector) !== filterSector.value) return false;
    if (filterType.value   && i.incident_type !== filterType.value) return false;
    if (filterStatus.value !== null && i.resolved !== filterStatus.value) return false;
    if (filterDateFrom.value) {
      const from = new Date(filterDateFrom.value);
      if (new Date(i.date) < from) return false;
    }
    if (filterDateTo.value) {
      const to = new Date(filterDateTo.value);
      if (new Date(i.date) > to) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
});

const resetFilters = () => {
  filterSector.value   = null;
  filterType.value     = null;
  filterStatus.value   = null;
  filterDateFrom.value = null;
  filterDateTo.value   = null;
};

const formatDate = (d) => {
  if (!d) return '-';
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    return `${day}/${month}/${year}`;
  }
  const dt = new Date(d);
  return isNaN(dt) ? '-' : dt.toLocaleDateString('es-PE');
};

const exportPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const BRAND = '#FF5B00';

  doc.setFillColor('#0F1115');
  doc.rect(0, 0, 297, 22, 'F');
  doc.setFontSize(16); doc.setTextColor(BRAND); doc.setFont('helvetica', 'bold');
  doc.text('RiskGuard', 14, 10);
  doc.setFontSize(9); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'normal');
  doc.text('Historial de Incidentes - Solo lectura | Ley Nro. 29783', 14, 17);
  doc.setFontSize(7); doc.setTextColor('#6B7280');
  doc.text(`Exportado: ${new Date().toLocaleDateString('es-PE')}`, 283, 17, { align: 'right' });

  autoTable(doc, {
    startY: 28,
    head: [['ID', 'Fecha', 'Sector', 'Tipo de Incidente', 'Descripcion', 'Criticidad', 'Estado', 'Hrs. Resolucion']],
    body: filteredIncidents.value.map(i => [
      i.id,
      formatDate(i.date),
      i.section || i.sector || '-',
      i.incident_type || '-',
      (i.description || '').substring(0, 45),
      i.criticality || i.severity || '-',
      i.resolved ? 'Resuelto' : 'Pendiente',
      i.resolution_time_hours ?? '-'
    ]),
    headStyles: { fillColor: [255, 91, 0], textColor: 255, fontStyle: 'bold', fontSize: 7 },
    bodyStyles: { fontSize: 7, textColor: [30, 30, 30] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: { 4: { cellWidth: 50 } },
    margin: { left: 14, right: 14 }, theme: 'striped'
  });

  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(6); doc.setTextColor('#6B7280');
    doc.text(`Pagina ${p} de ${pages} - RiskGuard - Documento de solo lectura`, 148, 205, { align: 'center' });
  }

  doc.save(`RiskGuard_Historial_Incidentes_${new Date().toISOString().slice(0,10)}.pdf`);
  toast.add({ severity: 'success', summary: t('common.success'), detail: t('success.report_downloaded'), life: 3000 });
};
</script>

<template>
  <div class="history-container">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('incident_history.title') }}</h1>
        <p class="page-subtitle">{{ t('incident_history.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <pv-tag
            :value="`${filteredIncidents.length} ${t('incident_history.records')}`"
            severity="info"
        />
        <pv-button
            icon="pi pi-file-pdf"
            :label="t('incident_history.export_pdf')"
            severity="warning"
            @click="exportPDF"
        />
      </div>
    </div>

    <!-- READONLY BANNER -->
    <div class="readonly-banner">
      <i class="pi pi-lock"></i>
      <span>{{ t('incident_history.readonly_notice') }}</span>
    </div>

    <!-- FILTERS -->
    <div class="filters-section">
      <h3 class="section-title">{{ t('my_reports.filters') }}</h3>
      <div class="filter-grid">

        <div class="filter-item">
          <label class="filter-label">{{ t('predictive_indicators.sector') }}</label>
          <pv-select
              v-model="filterSector"
              :options="sectorOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :show-clear="true"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">{{ t('my_reports.type') }}</label>
          <pv-select
              v-model="filterType"
              :options="typeOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :show-clear="true"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">{{ t('common.status') }}</label>
          <pv-select
              v-model="filterStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              class="w-full"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">{{ t('new_report.date_from') }}</label>
          <pv-calendar
              v-model="filterDateFrom"
              date-format="dd/mm/yy"
              show-icon
              class="w-full"
          />
        </div>

        <div class="filter-item">
          <label class="filter-label">{{ t('new_report.date_to') }}</label>
          <pv-calendar
              v-model="filterDateTo"
              date-format="dd/mm/yy"
              show-icon
              class="w-full"
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

      <div v-if="store.loadingIncidents" class="loading-state">
        <pv-spinner />
      </div>

      <div v-else-if="filteredIncidents.length === 0" class="empty-state">
        <i class="pi pi-inbox empty-icon"></i>
        <p>{{ t('my_reports.no_reports') }}</p>
      </div>

      <pv-data-table
          v-else
          :value="filteredIncidents"
          :paginator="true"
          :rows="15"
          responsive-layout="scroll"
          :row-hover="true"
      >
        <pv-column field="id" :header="t('my_reports.id')" style="width:10%" />

        <pv-column :header="t('my_reports.date')" style="width:10%">
          <template #body="{ data }">{{ formatDate(data.date) }}</template>
        </pv-column>

        <pv-column :header="t('predictive_indicators.sector')" style="width:13%">
          <template #body="{ data }">{{ data.section || data.sector || '-' }}</template>
        </pv-column>

        <pv-column :header="t('my_reports.type')" style="width:15%">
          <template #body="{ data }">{{ data.incident_type || '-' }}</template>
        </pv-column>

        <pv-column :header="t('incident_history.description')" style="width:18%">
          <template #body="{ data }">
            <span class="description-cell">{{ data.description || '-' }}</span>
          </template>
        </pv-column>

        <pv-column :header="t('incident_history.criticality')" style="width:10%">
          <template #body="{ data }">
            <pv-tag
                v-if="data.criticality || data.severity"
                :value="data.criticality || data.severity"
                :severity="
                  (data.criticality || data.severity || '').toLowerCase() === 'critical' ? 'danger' :
                  (data.criticality || data.severity || '').toLowerCase() === 'high'     ? 'warning' :
                  'info'
                "
            />
            <span v-else>-</span>
          </template>
        </pv-column>

        <pv-column :header="t('incident_history.operator')" style="width:10%">
          <template #body="{ data }">
            {{ data.operator_id || data.operario_id || '-' }}
          </template>
        </pv-column>

        <pv-column :header="t('common.status')" style="width:10%">
          <template #body="{ data }">
            <pv-tag
                :value="data.resolved ? t('notifications.resolved') : t('notifications.unresolved')"
                :severity="data.resolved ? 'success' : 'danger'"
            />
          </template>
        </pv-column>

        <pv-column :header="t('incident_history.resolution_hours')" style="width:10%">
          <template #body="{ data }">
            {{ data.resolution_time_hours != null ? `${data.resolution_time_hours}h` : '-' }}
          </template>
        </pv-column>

      </pv-data-table>
    </div>

  </div>
</template>

<style scoped>
.history-container {
  padding: 30px;
  background-color: var(--dark-bg);
  color: var(--text-color);
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
  flex-wrap: wrap;
  gap: 16px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.readonly-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #93C5FD;
}

.readonly-banner i {
  font-size: 14px;
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
  background: var(--rg-bg-3, #1a1e24);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-section {
  background: var(--rg-bg-3, #1a1e24);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.description-cell {
  font-size: 12px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  gap: 12px;
}

.empty-icon { font-size: 48px; opacity: 0.4; }

@media (max-width: 768px) {
  .history-container { padding: 15px; }
  .page-header { flex-direction: column; }
  .page-title { font-size: 22px; }
  .filter-grid { grid-template-columns: 1fr; }
}
</style>
