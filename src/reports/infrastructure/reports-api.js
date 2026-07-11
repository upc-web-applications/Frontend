import { BaseApi } from "@/shared/infrastructure/base-api.js";
import { BaseEndpoint } from "@/shared/infrastructure/base-endpoint.js";

import { MonthlyReportAssembler } from "@/reports/infrastructure/monthly-report-assembler.js";
import { GeneratedReportAssembler } from "@/reports/infrastructure/generated-report-assembler.js";
import { CumulativeSTIndicatorsAssembler } from "@/reports/infrastructure/cumulative-she-indicators-assembler.js";
import { HistoricalIncidentRecordsAssembler } from "@/reports/infrastructure/historical-incidents-records-assembler.js";
import { AnnualOHSPlanAssembler } from "@/reports/infrastructure/annual-she-plan-assembler.js";
import { PredictiveIndicatorsAssembler } from "@/reports/infrastructure/predictive-indicators-assembler.js";
import { CriticalAlertsAssembler } from "@/reports/infrastructure/critical-alerts-assembler.js";
import { KPIDashboardAssembler } from "@/reports/infrastructure/kpi_dashboard.assembler.js";
import { HistoricalTrendsAssembler } from "@/reports/infrastructure/historical-trends-assembler.js";
import { TicketAssembler } from "@/monitoring-dashboard/infrastructure/ticket.assembler.js";

const monthlyReportsEndpointPath = import.meta.env.VITE_MONTHLY_REPORTS_ENDPOINT_PATH;
const generatedReportsEndpointPath = import.meta.env.VITE_GENERATED_REPORTS_ENDPOINT_PATH;
const indicatorsEndpointPath = import.meta.env.VITE_INDICATORS_ENDPOINT_PATH;
const incidentsEndpointPath = import.meta.env.VITE_INCIDENTS_ENDPOINT_PATH;
const annualOHSPlanEndpointPath = import.meta.env.VITE_ANNUAL_SST_PLAN_ENDPOINT_PATH;
const predictiveIndicatorsEndpointPath = import.meta.env.VITE_PREDICTIVE_INDICATORS_ENDPOINT_PATH;
const criticalAlertsEndpointPath = import.meta.env.VITE_CRITICAL_ALERTS_ENDPOINT_PATH;
const kpiDashboardEndpointPath = import.meta.env.VITE_DASHBOARD_KPI_ENDPOINT_PATH;
const trendsEndpointPath = import.meta.env.VITE_TRENDS_ENDPOINT_PATH;
const supervisorTicketsEndpointPath = import.meta.env.VITE_TICKETS_ENDPOINT_PATH;

export class ReportsApi extends BaseApi {
    #monthlyReportsEndpoint;
    #generatedReportsEndpoint;
    #indicatorsEndpoint;
    #incidentsEndpoint;
    #annualOHSPlanEndpoint;
    #predictiveIndicatorsEndpoint;
    #criticalAlertsEndpoint;
    #kpiDashboardEndpoint;
    #trendsEndpoint;
    #supervisorTicketsEndpoint;

    constructor() {
        super();

        this.#monthlyReportsEndpoint = new BaseEndpoint(this, monthlyReportsEndpointPath);
        this.#generatedReportsEndpoint = new BaseEndpoint(this, generatedReportsEndpointPath);
        this.#indicatorsEndpoint = new BaseEndpoint(this, indicatorsEndpointPath);
        this.#incidentsEndpoint = new BaseEndpoint(this, incidentsEndpointPath);
        this.#annualOHSPlanEndpoint = new BaseEndpoint(this, annualOHSPlanEndpointPath);
        this.#predictiveIndicatorsEndpoint = new BaseEndpoint(this, predictiveIndicatorsEndpointPath);
        this.#criticalAlertsEndpoint = new BaseEndpoint(this, criticalAlertsEndpointPath);
        this.#kpiDashboardEndpoint = new BaseEndpoint(this, kpiDashboardEndpointPath);
        this.#trendsEndpoint = new BaseEndpoint(this, trendsEndpointPath);
        this.#supervisorTicketsEndpoint = new BaseEndpoint(this, supervisorTicketsEndpointPath);
    }

    // ===== MONTHLY REPORTS =====
    async getMonthlyReports() {
        try {
            const response = await this.#monthlyReportsEndpoint.getAll();
            return MonthlyReportAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getMonthlyReportById(id) {
        try {
            const response = await this.#monthlyReportsEndpoint.getById(id);
            return MonthlyReportAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async createMonthlyReport(report) {
        try {
            const response = await this.#monthlyReportsEndpoint.create(MonthlyReportAssembler.toResourceFromEntity(report));
            return MonthlyReportAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async updateMonthlyReport(report) {
        try {
            const response = await this.#monthlyReportsEndpoint.update(report.id, MonthlyReportAssembler.toResourceFromEntity(report));
            return MonthlyReportAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async deleteMonthlyReport(id) {
        try {
            return await this.#monthlyReportsEndpoint.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // ===== GENERATED REPORTS =====
    async getGeneratedReports() {
        try {
            const response = await this.#generatedReportsEndpoint.getAll();
            return GeneratedReportAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getGeneratedReportById(id) {
        try {
            const response = await this.#generatedReportsEndpoint.getById(id);
            return GeneratedReportAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async createGeneratedReport(report) {
        try {
            const response = await this.#generatedReportsEndpoint.create(GeneratedReportAssembler.toResourceFromEntity(report));
            return GeneratedReportAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async deleteGeneratedReport(id) {
        try {
            return await this.#generatedReportsEndpoint.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // ===== CUMULATIVE ST INDICATORS =====
    async getIndicators() {
        try {
            const response = await this.#indicatorsEndpoint.getAll();
            return CumulativeSTIndicatorsAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getIndicatorById(id) {
        try {
            const response = await this.#indicatorsEndpoint.getById(id);
            return CumulativeSTIndicatorsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    // ===== HISTORICAL INCIDENT RECORDS =====
    async getIncidents() {
        try {
            const response = await this.#incidentsEndpoint.getAll();
            return HistoricalIncidentRecordsAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getIncidentById(id) {
        try {
            const response = await this.#incidentsEndpoint.getById(id);
            return HistoricalIncidentRecordsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async createIncident(incident) {
        try {
            const response = await this.#incidentsEndpoint.create(HistoricalIncidentRecordsAssembler.toResourceFromEntity(incident));
            return HistoricalIncidentRecordsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async updateIncident(incident) {
        try {
            const response = await this.#incidentsEndpoint.update(incident.id, HistoricalIncidentRecordsAssembler.toResourceFromEntity(incident));
            return HistoricalIncidentRecordsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async deleteIncident(id) {
        try {
            return await this.#incidentsEndpoint.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // ===== ANNUAL OHS PLAN =====
    async getAnnualOHSPlan() {
        try {
            const response = await this.#annualOHSPlanEndpoint.getAll();
            return AnnualOHSPlanAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getAnnualOHSPlanById(id) {
        try {
            const response = await this.#annualOHSPlanEndpoint.getById(id);
            return AnnualOHSPlanAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async updateAnnualOHSPlan(plan) {
        try {
            const response = await this.#annualOHSPlanEndpoint.update(plan.id, AnnualOHSPlanAssembler.toResourceFromEntity(plan));
            return AnnualOHSPlanAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    // ===== PREDICTIVE INDICATORS =====
    async getPredictiveIndicators() {
        try {
            const response = await this.#predictiveIndicatorsEndpoint.getAll();
            return PredictiveIndicatorsAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getPredictiveIndicatorById(id) {
        try {
            const response = await this.#predictiveIndicatorsEndpoint.getById(id);
            return PredictiveIndicatorsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    // ===== CRITICAL ALERTS =====
    async getCriticalAlerts() {
        try {
            const response = await this.#criticalAlertsEndpoint.getAll();
            return CriticalAlertsAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getCriticalAlertById(id) {
        try {
            const response = await this.#criticalAlertsEndpoint.getById(id);
            return CriticalAlertsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async updateCriticalAlert(alert) {
        try {
            const response = await this.#criticalAlertsEndpoint.update(alert.id, CriticalAlertsAssembler.toResourceFromEntity(alert));
            return CriticalAlertsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async createCriticalAlert(alert) {
        try {
            const response = await this.#criticalAlertsEndpoint.create(CriticalAlertsAssembler.toResourceFromEntity(alert));
            return CriticalAlertsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async deleteCriticalAlert(id) {
        try {
            return await this.#criticalAlertsEndpoint.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // ===== KPI DASHBOARD =====
    async getKPIDashboard() {
        try {
            const response = await this.#kpiDashboardEndpoint.getAll();
            return KPIDashboardAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getKPIById(id) {
        try {
            const response = await this.#kpiDashboardEndpoint.getById(id);
            return KPIDashboardAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    // ===== HISTORICAL TRENDS =====
    async getHistoricalTrends() {
        try {
            const response = await this.#trendsEndpoint.getAll();
            return HistoricalTrendsAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async getHistoricalTrendById(id) {
        try {
            const response = await this.#trendsEndpoint.getById(id);
            return HistoricalTrendsAssembler.toEntityFromResource(response.data);
        } catch (error) {
            throw error;
        }
    }

    async getSupervisorTickets() {
        try {
            const response = await this.#supervisorTicketsEndpoint.getAll();
            return TicketAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            throw error;
        }
    }

}
