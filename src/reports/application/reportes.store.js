import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { ReportsApi } from '@/reports/infrastructure/reports-api.js';

export const useReportsStore = defineStore('reports', () => {
    const api = new ReportsApi();
    const monthlyReports = ref([]);
    const currentMonthlyReport = ref(null);
    const loadingMonthlyReports = ref(false);
    const errorMonthlyReports = ref(null);
    const generatedReports = ref([]);
    const currentGeneratedReport = ref(null);
    const loadingGeneratedReports = ref(false);
    const errorGeneratedReports = ref(null);
    const incidents = ref([]);
    const loadingIncidents = ref(false);
    const errorIncidents = ref(null);
    const annualOHSPlan = ref(null);
    const loadingAnnualOHSPlan = ref(false);
    const errorAnnualOHSPlan = ref(null);
    const predictiveIndicators = ref([]);
    const loadingPredictiveIndicators = ref(false);
    const errorPredictiveIndicators = ref(null);
    const criticalAlerts = ref([]);
    const loadingCriticalAlerts = ref(false);
    const errorCriticalAlerts = ref(null);
    const kpiDashboard = ref([]);
    const loadingKPI = ref(false);
    const errorKPI = ref(null);
    const historicalTrends = ref([]);
    const loadingHistoricalTrends = ref(false);
    const errorHistoricalTrends = ref(null);
    const isLoading = computed(() =>
        loadingMonthlyReports.value ||
        loadingGeneratedReports.value ||
        loadingIncidents.value ||
        loadingAnnualOHSPlan.value ||
        loadingPredictiveIndicators.value ||
        loadingCriticalAlerts.value ||
        loadingKPI.value ||
        loadingHistoricalTrends.value
    );

    const unresolvedCriticalAlerts = computed(() =>
        criticalAlerts.value.filter(
            a => a.type === 'CRITICAL' && a.status === 'unresolved'
        )
    );
    const activeIncidents = computed(() =>
        incidents.value.filter(i => !i.resolved)
    );
    const resolvedIncidents = computed(() =>
        incidents.value.filter(i => i.resolved)
    );

    function syncKPIs() {
        if (!kpiDashboard.value.length) return;

        const activeCount = incidents.value.filter(i => !i.resolved).length;
        const resolvedCount = incidents.value.filter(i => i.resolved).length;
        const criticalSectorCount = new Set(
            criticalAlerts.value
                .filter(a => a.status === 'unresolved' || a.status === 'in_review')
                .map(a => a.sector)
        ).size;

        kpiDashboard.value = kpiDashboard.value.map(kpi => {
            if (kpi.name === 'active_incidents') {
                return { ...kpi, value: activeCount,
                    status: activeCount === 0 ? 'optimal' : 'alert' };
            }
            if (kpi.name === 'resolved_incidents') {
                return { ...kpi, value: resolvedCount,
                    status: resolvedCount >= kpi.goal ? 'optimal' : 'alert' };
            }
            if (kpi.name === 'critical_sectors') {
                return { ...kpi, value: criticalSectorCount,
                    status: criticalSectorCount === 0 ? 'optimal' : criticalSectorCount <= 2 ? 'alert' : 'danger' };
            }
            return kpi;
        });
    }

    // Auto-sync KPIs cuando los datos en vivo cambian (ej: al completar el fetch inicial)
    watch([incidents, criticalAlerts], () => {
        if (kpiDashboard.value.length) {
            syncKPIs();
        }
    }, { deep: false });
    async function fetchMonthlyReports() {
        loadingMonthlyReports.value = true;
        errorMonthlyReports.value = null;

        try {
            monthlyReports.value = await api.getMonthlyReports();
            console.log('Monthly reports fetched:', monthlyReports.value);
        } catch (error) {
            errorMonthlyReports.value = error.message;
            console.error('Error fetching monthly reports:', error);
        } finally {
            loadingMonthlyReports.value = false;
        }
    }
    async function fetchMonthlyReportById(id) {
        loadingMonthlyReports.value = true;
        errorMonthlyReports.value = null;

        try {
            currentMonthlyReport.value = await api.getMonthlyReportById(id);
            console.log('Monthly report fetched:', currentMonthlyReport.value);
        } catch (error) {
            errorMonthlyReports.value = error.message;
            console.error('Error fetching monthly report:', error);
        } finally {
            loadingMonthlyReports.value = false;
        }
    }

    async function createMonthlyReport(report) {
        loadingMonthlyReports.value = true;
        errorMonthlyReports.value = null;

        try {
            const newReport = await api.createMonthlyReport(report);
            monthlyReports.value.push(newReport);

            console.log('Monthly report created:', newReport);

            return newReport;
        } catch (error) {
            errorMonthlyReports.value = error.message;
            console.error('Error creating monthly report:', error);
            throw error;
        } finally {
            loadingMonthlyReports.value = false;
        }
    }


    // ===== ACTIONS: GENERATED REPORTS =====

    async function fetchGeneratedReports() {
        loadingGeneratedReports.value = true;
        errorGeneratedReports.value = null;

        try {
            generatedReports.value = await api.getGeneratedReports();
            console.log('Generated reports fetched:', generatedReports.value);
        } catch (error) {
            errorGeneratedReports.value = error.message;
            console.error('Error fetching generated reports:', error);
        } finally {
            loadingGeneratedReports.value = false;
        }
    }

    async function fetchGeneratedReportById(id) {
        loadingGeneratedReports.value = true;
        errorGeneratedReports.value = null;

        try {
            currentGeneratedReport.value =
                await api.getGeneratedReportById(id);

            console.log(
                'Generated report fetched:',
                currentGeneratedReport.value
            );
        } catch (error) {
            errorGeneratedReports.value = error.message;
            console.error('Error fetching generated report:', error);
        } finally {
            loadingGeneratedReports.value = false;
        }
    }

    async function createGeneratedReport(report) {
        loadingGeneratedReports.value = true;
        errorGeneratedReports.value = null;

        try {
            const newReport = await api.createGeneratedReport(report);

            generatedReports.value.push(newReport);

            console.log('Generated report created:', newReport);

            return newReport;
        } catch (error) {
            errorGeneratedReports.value = error.message;
            console.error('Error creating generated report:', error);
            throw error;
        } finally {
            loadingGeneratedReports.value = false;
        }
    }

    async function deleteGeneratedReport(id) {
        loadingGeneratedReports.value = true;
        errorGeneratedReports.value = null;

        try {
            await api.deleteGeneratedReport(id);

            generatedReports.value = generatedReports.value.filter(
                r => r.id !== id
            );

            console.log('Generated report deleted:', id);
        } catch (error) {
            errorGeneratedReports.value = error.message;
            console.error('Error deleting generated report:', error);
            throw error;
        } finally {
            loadingGeneratedReports.value = false;
        }
    }
    // ===== ACTIONS: INCIDENTS =====

    async function fetchIncidents() {
        loadingIncidents.value = true;
        errorIncidents.value = null;

        try {
            incidents.value = await api.getIncidents();
            console.log('Incidents fetched:', incidents.value);
        } catch (error) {
            errorIncidents.value = error.message;
            console.error('Error fetching incidents:', error);
        } finally {
            loadingIncidents.value = false;
        }
    }

    async function updateIncident(incident) {
        loadingIncidents.value = true;
        errorIncidents.value = null;

        try {
            const updatedIncident = await api.updateIncident(incident);

            const index = incidents.value.findIndex(
                i => i.id === incident.id
            );

            if (index !== -1) {
                incidents.value[index] = updatedIncident;
            }

            syncKPIs();

            console.log('Incident updated:', updatedIncident);

            return updatedIncident;
        } catch (error) {
            errorIncidents.value = error.message;
            console.error('Error updating incident:', error);
            throw error;
        } finally {
            loadingIncidents.value = false;
        }
    }
    async function fetchAnnualOHSPlan() {
        loadingAnnualOHSPlan.value = true;
        errorAnnualOHSPlan.value = null;

        try {
            const plans = await api.getAnnualOHSPlan();

            annualOHSPlan.value = plans.length > 0
                ? plans[0]
                : null;

            console.log(
                'Annual OHS plan fetched:',
                annualOHSPlan.value
            );
        } catch (error) {
            errorAnnualOHSPlan.value = error.message;
            console.error('Error fetching annual OHS plan:', error);
        } finally {
            loadingAnnualOHSPlan.value = false;
        }
    }

    async function updateAnnualOHSPlan(plan) {
        loadingAnnualOHSPlan.value = true;
        errorAnnualOHSPlan.value = null;

        try {
            annualOHSPlan.value =
                await api.updateAnnualOHSPlan(plan);

            console.log(
                'Annual OHS plan updated:',
                annualOHSPlan.value
            );

            return annualOHSPlan.value;
        } catch (error) {
            errorAnnualOHSPlan.value = error.message;
            console.error('Error updating annual OHS plan:', error);
            throw error;
        } finally {
            loadingAnnualOHSPlan.value = false;
        }
    }

    // ===== ACTIONS: PREDICTIVE INDICATORS =====

    async function fetchPredictiveIndicators() {
        loadingPredictiveIndicators.value = true;
        errorPredictiveIndicators.value = null;

        try {
            predictiveIndicators.value =
                await api.getPredictiveIndicators();

            console.log(
                'Predictive indicators fetched:',
                predictiveIndicators.value
            );
        } catch (error) {
            errorPredictiveIndicators.value = error.message;
            console.error(
                'Error fetching predictive indicators:',
                error
            );
        } finally {
            loadingPredictiveIndicators.value = false;
        }
    }

    // ===== ACTIONS: CRITICAL ALERTS =====

    async function fetchCriticalAlerts() {
        loadingCriticalAlerts.value = true;
        errorCriticalAlerts.value = null;

        try {
            criticalAlerts.value =
                await api.getCriticalAlerts();

            console.log(
                'Critical alerts fetched:',
                criticalAlerts.value
            );
        } catch (error) {
            errorCriticalAlerts.value = error.message;
            console.error(
                'Error fetching critical alerts:',
                error
            );
        } finally {
            loadingCriticalAlerts.value = false;
        }
    }

    async function updateCriticalAlert(alert) {
        loadingCriticalAlerts.value = true;
        errorCriticalAlerts.value = null;

        try {
            const updatedAlert =
                await api.updateCriticalAlert(alert);

            const index = criticalAlerts.value.findIndex(
                a => a.id === alert.id
            );

            if (index !== -1) {
                criticalAlerts.value[index] = updatedAlert;
            }

            syncKPIs();

            console.log(
                'Critical alert updated:',
                updatedAlert
            );

            return updatedAlert;
        } catch (error) {
            errorCriticalAlerts.value = error.message;
            console.error(
                'Error updating critical alert:',
                error
            );
            throw error;
        } finally {
            loadingCriticalAlerts.value = false;
        }
    }

    async function deleteCriticalAlert(id) {
        loadingCriticalAlerts.value = true;
        errorCriticalAlerts.value = null;

        try {
            await api.deleteCriticalAlert(id);

            criticalAlerts.value = criticalAlerts.value.filter(
                a => a.id !== id
            );

            console.log('Critical alert deleted:', id);
        } catch (error) {
            errorCriticalAlerts.value = error.message;
            console.error(
                'Error deleting critical alert:',
                error
            );
            throw error;
        } finally {
            loadingCriticalAlerts.value = false;
        }
    }
    async function fetchKPIDashboard() {
        loadingKPI.value = true;
        errorKPI.value = null;

        try {
            kpiDashboard.value =
                await api.getKPIDashboard();

            console.log(
                'KPI dashboard fetched:',
                kpiDashboard.value
            );
        } catch (error) {
            errorKPI.value = error.message;
            console.error(
                'Error fetching KPI dashboard:',
                error
            );
        } finally {
            loadingKPI.value = false;
        }
    }

    async function fetchHistoricalTrends() {
        loadingHistoricalTrends.value = true;
        errorHistoricalTrends.value = null;

        try {
            historicalTrends.value =
                await api.getHistoricalTrends();

            console.log(
                'Historical trends fetched:',
                historicalTrends.value
            );
        } catch (error) {
            errorHistoricalTrends.value = error.message;
            console.error(
                'Error fetching historical trends:',
                error
            );
        } finally {
            loadingHistoricalTrends.value = false;
        }
    }

    return {
        monthlyReports, currentMonthlyReport, loadingMonthlyReports, errorMonthlyReports,
        generatedReports, currentGeneratedReport, loadingGeneratedReports, errorGeneratedReports,
        incidents, loadingIncidents, errorIncidents,
        annualOHSPlan, loadingAnnualOHSPlan, errorAnnualOHSPlan,
        predictiveIndicators, loadingPredictiveIndicators, errorPredictiveIndicators,
        criticalAlerts, loadingCriticalAlerts, errorCriticalAlerts,
        kpiDashboard, loadingKPI, errorKPI,
        historicalTrends, loadingHistoricalTrends, errorHistoricalTrends,
        isLoading, unresolvedCriticalAlerts, activeIncidents, resolvedIncidents,
        fetchMonthlyReports, fetchMonthlyReportById, createMonthlyReport,
        fetchGeneratedReports, fetchGeneratedReportById, createGeneratedReport, deleteGeneratedReport,
        fetchIncidents, updateIncident,
        fetchAnnualOHSPlan, updateAnnualOHSPlan,
        fetchPredictiveIndicators,
        fetchCriticalAlerts, updateCriticalAlert, deleteCriticalAlert,
        fetchKPIDashboard, fetchHistoricalTrends, syncKPIs
    };
});