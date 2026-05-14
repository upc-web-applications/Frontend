<script setup>
import { useI18n } from 'vue-i18n';
import { useReportsStore } from '@/reports/application/reportes.store.js';
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const store = useReportsStore();
const toast = useToast();

onMounted(async () => {
  try {
    await store.fetchCriticalAlerts();
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error.message, life: 3000 });
  }
});

const getAlertSeverity = (type) => {
  if (type === 'CRITICAL') return 'danger';
  if (type === 'ALERT') return 'warning';
  return 'info';
};

const getStatusSeverity = (status) => {
  if (status === 'unresolved') return 'danger';
  if (status === 'in_review') return 'warning';
  return 'success';
};

const getStatusLabel = (status) => {
  const map = {
    unresolved: t('notifications.unresolved'),
    in_review: t('notifications.in_review'),
    resolved: t('notifications.resolved')
  };
  return map[status] || status;
};

const markAsResolved = async (alert) => {
  try {
    await store.updateCriticalAlert({ ...alert, status: 'resolved' });
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('success.action_completed'),
      life: 3000
    });
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error.message, life: 3000 });
  }
};

const deleteAlert = async (alert) => {
  try {
    await store.deleteCriticalAlert(alert.id);
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t('success.data_deleted'),
      life: 3000
    });
  } catch (error) {
    toast.add({ severity: 'error', summary: t('common.error'), detail: error.message, life: 3000 });
  }
};
</script>

<template>
  <div class="alerts-container">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('notifications.title') }}</h1>
        <p class="page-subtitle">{{ t('dashboard.monitor') }}</p>
      </div>
      <pv-tag
          :value="`${store.unresolvedCriticalAlerts.length} ${t('notifications.critical')}`"
          severity="danger"
          class="count-tag"
      />
    </div>

    <!-- TABLE -->
    <div class="table-wrapper">

      <div v-if="store.isLoading" class="loading-state">
        <pv-spinner />
      </div>

      <div v-else-if="store.criticalAlerts.length === 0" class="empty-state">
        <i class="pi pi-inbox empty-icon"></i>
        <p>{{ t('notifications.no_notifications') }}</p>
      </div>

      <pv-data-table
          v-else
          :value="store.criticalAlerts"
          :paginator="true"
          :rows="10"
          responsive-layout="scroll"
          :sort-field="'creation_date'"
          :sort-order="-1"
      >

        <!-- TYPE -->
        <pv-column field="type" :header="t('notifications.type')" sortable style="width: 10%">
          <template #body="{ data }">
            <pv-tag
                :value="data.type"
                :severity="getAlertSeverity(data.type)"
            />
          </template>
        </pv-column>

        <!-- SECTOR -->
        <pv-column field="sector" :header="t('notifications.sector')" sortable style="width: 13%">
          <template #body="{ data }">
            <span class="sector-badge">{{ data.sector }}</span>
          </template>
        </pv-column>

        <!-- RISK TYPE -->
        <pv-column field="risk_type" :header="t('notifications.risk_type')" sortable style="width: 16%" />

        <!-- MESSAGE -->
        <pv-column field="message" :header="t('notifications.message')" style="width: 25%">
          <template #body="{ data }">
            <span class="message-cell">{{ data.message }}</span>
          </template>
        </pv-column>

        <!-- ELAPSED -->
        <pv-column field="elapsed_hours" :header="t('notifications.time_elapsed')" sortable style="width: 10%">
          <template #body="{ data }">
            {{ data.elapsed_hours }}h
          </template>
        </pv-column>

        <!-- SUPERVISOR -->
        <pv-column field="responsible_supervisor" :header="t('sidebar.role_manager')" sortable style="width: 12%" />

        <!-- STATUS -->
        <pv-column field="status" :header="t('common.status')" sortable style="width: 10%">
          <template #body="{ data }">
            <pv-tag
                :value="getStatusLabel(data.status)"
                :severity="getStatusSeverity(data.status)"
            />
          </template>
        </pv-column>

        <!-- ACTIONS -->
        <pv-column :header="t('my_reports.actions')" style="width: 10%">
          <template #body="{ data }">
            <div class="actions">
              <pv-button
                  v-if="data.status !== 'resolved'"
                  icon="pi pi-check"
                  rounded
                  severity="success"
                  size="small"
                  @click="markAsResolved(data)"
                  v-tooltip.top="t('notifications.resolved')"
              />
              <pv-button
                  icon="pi pi-trash"
                  rounded
                  severity="danger"
                  size="small"
                  @click="deleteAlert(data)"
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
.alerts-container {
  background: var(--dark-bg);
  min-height: 100%;
  padding: 30px;
  color: var(--text-color);
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

.count-tag {
  font-size: 13px;
  padding: 6px 14px;
}

.table-wrapper {
  background: linear-gradient(135deg, #1a1e24 0%, #0f1115 100%);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.sector-badge {
  background: rgba(255, 91, 0, 0.15);
  color: var(--primary-color);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.message-cell {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  gap: 6px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text-secondary);
  gap: 16px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

:deep(.p-datatable-thead > tr > th) {
  background: rgba(255, 91, 0, 0.08);
  color: var(--primary-color);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-color: var(--border-color);
}

:deep(.p-datatable-tbody > tr) {
  background: transparent;
  border-color: var(--border-color);
  transition: background 0.2s;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(255, 255, 255, 0.03) !important;
}

:deep(.p-datatable-tbody > tr > td) {
  border-color: var(--border-color);
  color: var(--text-color);
  font-size: 13px;
}

:deep(.p-paginator) {
  background: transparent;
  border-color: var(--border-color);
  color: var(--text-secondary);
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .alerts-container { padding: 15px; }
  .page-header { flex-direction: column; gap: 16px; }
  .page-title { font-size: 22px; }
}
</style>
