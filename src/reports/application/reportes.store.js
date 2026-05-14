import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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
    const indicators = ref([]);
    const currentIndicator = ref(null);
    const loadingIndicators = ref(false);
    const errorIndicators = ref(null);
    const incidents = ref([]);
    const currentIncident = ref(null);
    const loadingIncidents = ref(false);
    const errorIncidents = ref(null);
    const annualOHSPlan = ref(null);
    const loadingAnnualOHSPlan = ref(false);
    const errorAnnualOHSPlan = ref(null);
    const predictiveIndicators = ref([]);
    const currentPredictiveIndicator = ref(null);
    const loadingPredictiveIndicators = ref(false);
    const errorPredictiveIndicators = ref(null);
    const criticalAlerts = ref([]);
    const currentCriticalAlert = ref(null);
    const loadingCriticalAlerts = ref(false);
    const errorCriticalAlerts = ref(null);
    const kpiDashboard = ref([]);
    const loadingKPI = ref(false);
    const errorKPI = ref(null);
    const historicalTrends = ref([]);
    const currentHistoricalTrend = ref(null);
    const loadingHistoricalTrends = ref(false);
    const errorHistoricalTrends = ref(null);
    const isLoading = computed(() =>
        loadingMonthlyReports.value ||
        loadingGeneratedReports.value ||
        loadingIndicators.value ||
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

    async function updateMonthlyReport(report) {
        loadingMonthlyReports.value = true;
        errorMonthlyReports.value = null;

        try {
            const updatedReport = await api.updateMonthlyReport(report);

            const index = monthlyReports.value.findIndex(
                r => r.id === report.id
            );

            if (index !== -1) {
                monthlyReports.value[index] = updatedReport;
            }

            console.log('Monthly report updated:', updatedReport);

            return updatedReport;
        } catch (error) {
            errorMonthlyReports.value = error.message;
            console.error('Error updating monthly report:', error);
            throw error;
        } finally {
            loadingMonthlyReports.value = false;
        }
    }

    async function deleteMonthlyReport(id) {
        loadingMonthlyReports.value = true;
        errorMonthlyReports.value = null;

        try {
            await api.deleteMonthlyReport(id);

            monthlyReports.value = monthlyReports.value.filter(
                r => r.id !== id
            );

            console.log('Monthly report deleted:', id);
        } catch (error) {
            errorMonthlyReports.value = error.message;
            console.error('Error deleting monthly report:', error);
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
    async function fetchIndicators() {
        loadingIndicators.value = true;
        errorIndicators.value = null;

        try {
            indicators.value = await api.getIndicators();
            console.log('Indicators fetched:', indicators.value);
        } catch (error) {
            errorIndicators.value = error.message;
            console.error('Error fetching indicators:', error);
        } finally {
            loadingIndicators.value = false;
        }
    }

    async function fetchIndicatorById(id) {
        loadingIndicators.value = true;
        errorIndicators.value = null;

        try {
            currentIndicator.value = await api.getIndicatorById(id);
            console.log('Indicator fetched:', currentIndicator.value);
        } catch (error) {
            errorIndicators.value = error.message;
            console.error('Error fetching indicator:', error);
        } finally {
            loadingIndicators.value = false;
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

    async function fetchIncidentById(id) {
        loadingIncidents.value = true;
        errorIncidents.value = null;

        try {
            currentIncident.value = await api.getIncidentById(id);
            console.log('Incident fetched:', currentIncident.value);
        } catch (error) {
            errorIncidents.value = error.message;
            console.error('Error fetching incident:', error);
        } finally {
            loadingIncidents.value = false;
        }
    }

    async function createIncident(incident) {
        loadingIncidents.value = true;
        errorIncidents.value = null;

        try {
            const newIncident = await api.createIncident(incident);

            incidents.value.push(newIncident);

            console.log('Incident created:', newIncident);

            return newIncident;
        } catch (error) {
            errorIncidents.value = error.message;
            console.error('Error creating incident:', error);
            throw error;
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

    async function fetchAnnualOHSPlanById(id) {
        loadingAnnualOHSPlan.value = true;
        errorAnnualOHSPlan.value = null;

        try {
            annualOHSPlan.value =
                await api.getAnnualOHSPlanById(id);

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

    async function fetchPredictiveIndicatorById(id) {
        loadingPredictiveIndicators.value = true;
        errorPredictiveIndicators.value = null;

        try {
            currentPredictiveIndicator.value =
                await api.getPredictiveIndicatorById(id);

            console.log(
                'Predictive indicator fetched:',
                currentPredictiveIndicator.value
            );
        } catch (error) {
            errorPredictiveIndicators.value = error.message;
            console.error(
                'Error fetching predictive indicator:',
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

    async function fetchCriticalAlertById(id) {
        loadingCriticalAlerts.value = true;
        errorCriticalAlerts.value = null;

        try {
            currentCriticalAlert.value =
                await api.getCriticalAlertById(id);

            console.log(
                'Critical alert fetched:',
                currentCriticalAlert.value
            );
        } catch (error) {
            errorCriticalAlerts.value = error.message;
            console.error(
                'Error fetching critical alert:',
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

    async function fetchKPIById(id) {
        loadingKPI.value = true;
        errorKPI.value = null;

        try {
            const kpi = await api.getKPIById(id);

            const index = kpiDashboard.value.findIndex(
                k => k.id === id
            );

            if (index !== -1) {
                kpiDashboard.value[index] = kpi;
            }

            console.log('KPI fetched:', kpi);

            return kpi;
        } catch (error) {
            errorKPI.value = error.message;
            console.error('Error fetching KPI:', error);
        } finally {
            loadingKPI.value = false;
        }
    }

    // ===== ACTIONS: HISTORICAL TRENDS =====

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

    async function fetchHistoricalTrendById(id) {
        loadingHistoricalTrends.value = true;
        errorHistoricalTrends.value = null;

        try {
            currentHistoricalTrend.value =
                await api.getHistoricalTrendById(id);

            console.log(
                'Historical trend fetched:',
                currentHistoricalTrend.value
            );
        } catch (error) {
            errorHistoricalTrends.value = error.message;
            console.error(
                'Error fetching historical trend:',
                error
            );
        } finally {
            loadingHistoricalTrends.value = false;
        }
    }

    function resetState() {
        monthlyReports.value = [];currentMonthlyReport.value = null;
        generatedReports.value = [];currentGeneratedReport.value = null;
        indicators.value = [];currentIndicator.value = null;
        incidents.value = [];currentIncident.value = null;annualOHSPlan.value = null;
        predictiveIndicators.value = [];currentPredictiveIndicator.value = null;
        criticalAlerts.value = [];currentCriticalAlert.value = null;kpiDashboard.value = [];
        historicalTrends.value = [];currentHistoricalTrend.value = null;
    }

    return {
        monthlyReports, currentMonthlyReport, loadingMonthlyReports,
        errorMonthlyReports, generatedReports, currentGeneratedReport, loadingGeneratedReports, errorGeneratedReports,
        indicators, currentIndicator, loadingIndicators, errorIndicators,
        incidents, currentIncident, loadingIncidents, errorIncidents,
        annualOHSPlan, loadingAnnualOHSPlan, errorAnnualOHSPlan, predictiveIndicators, currentPredictiveIndicator,
        loadingPredictiveIndicators, errorPredictiveIndicators,
        criticalAlerts, currentCriticalAlert, loadingCriticalAlerts, errorCriticalAlerts,
        kpiDashboard, loadingKPI, errorKPI, historicalTrends, currentHistoricalTrend,
        loadingHistoricalTrends, errorHistoricalTrends, isLoading,
        unresolvedCriticalAlerts, activeIncidents, resolvedIncidents,
        fetchMonthlyReports, fetchMonthlyReportById, createMonthlyReport, updateMonthlyReport, deleteMonthlyReport,
        fetchGeneratedReports, fetchGeneratedReportById, createGeneratedReport, deleteGeneratedReport,
        fetchIndicators, fetchIndicatorById, fetchIncidents, fetchIncidentById,
        createIncident, updateIncident, fetchAnnualOHSPlan, fetchAnnualOHSPlanById, updateAnnualOHSPlan,
        fetchPredictiveIndicators, fetchPredictiveIndicatorById, fetchCriticalAlerts, fetchCriticalAlertById, updateCriticalAlert,
        deleteCriticalAlert, fetchKPIDashboard, fetchKPIById, fetchHistoricalTrends, fetchHistoricalTrendById, resetState
    };
});