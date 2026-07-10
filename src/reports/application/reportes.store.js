import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { ReportsApi } from '@/reports/infrastructure/reports-api.js';
import { useTicketAccionCorrectivaStore } from '@/mitigation/application/ticket-accion-correctiva.store.js';

export const useReportsStore = defineStore('reports', () => {
    const api = new ReportsApi();
    const ticketAccionCorrectivaStore = useTicketAccionCorrectivaStore();
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
    const supervisorTickets = ref([]);
    const correctiveTickets = computed(() => ticketAccionCorrectivaStore.tickets);
    const loadingOperationalData = ref(false);
    const errorOperationalData = ref(null);
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
        loadingOperationalData.value ||
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

    const operationalTickets = computed(() =>
        correctiveTickets.value.map(ticket => normalizeCorrectiveTicket(ticket))
    );

    function normalizeText(value) {
        return (value || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function parseElapsedHours(value) {
        if (typeof value === 'number') return value;
        if (!value) return 0;
        if (normalizeText(value).includes('restante')) return 0;
        const match = value.toString().match(/\d+/);
        return match ? Number(match[0]) : 0;
    }

    function getSupervisorTimeLabel(ticket) {
        return ticket.elapsedTime || (ticket.generatedAt ? `Creado: ${new Date(ticket.generatedAt).toLocaleString('es-PE')}` : '-');
    }

    function isClosedStatus(status) {
        const normalized = normalizeText(status);
        return ['cerrado', 'resuelto', 'resolved', 'finalizado', 'closed'].includes(normalized);
    }

    function isActiveStatus(status) {
        return !isClosedStatus(status) && normalizeText(status) !== 'cancelada';
    }

    function isCriticalRisk(value) {
        const normalized = normalizeText(value);
        return normalized.includes('critico') || normalized.includes('critical') || normalized.includes('alto') || normalized.includes('alta');
    }

    function normalizeSupervisorTicket(ticket) {
        return {
            id: `SUP-${ticket.id}`,
            source: 'supervisor-dashboard',
            sourceId: ticket.id,
            sector: ticket.sector || '-',
            riskType: ticket.incidentType || '-',
            riskLevel: ticket.riskLevel || '',
            status: ticket.status || '',
            elapsedHours: parseElapsedHours(ticket.elapsedTime),
            timeLabel: getSupervisorTimeLabel(ticket),
            slaBreached: normalizeText(ticket.slaStatus).includes('incumplido'),
            createdAt: ticket.generatedAt || new Date().toISOString(),
            supervisor: ticket.assignedTechnician || 'Supervisor SST',
            message: ticket.description || `Ticket ${ticket.code || ticket.id} pendiente de seguimiento.`
        };
    }

    function normalizeCorrectiveTicket(ticket) {
        const createdAt = ticket.fechaCreacion || new Date().toISOString();
        const elapsedHours = ticket.fechaCierre
            ? Math.max(0, Math.round((new Date(ticket.fechaCierre) - new Date(createdAt)) / 36e5))
            : Math.max(0, Math.round((new Date() - new Date(createdAt)) / 36e5));

        return {
            id: `COR-${ticket.id}`,
            source: 'corrective-ticket',
            sourceId: ticket.id,
            sourceReportId: ticket.reporteId,
            sector: ticket.sector || '-',
            riskType: ticket.tipoRiesgo || '-',
            riskLevel: ticket.nivelCriticidad || '',
            status: ticket.estado || '',
            elapsedHours,
            timeLabel: ticket.slaIncumplido ? `SLA vencido (limite ${ticket.slaLimiteHoras || 24}h)` : `${elapsedHours}h transcurridas`,
            slaLimitHours: ticket.slaLimiteHoras || 24,
            slaBreached: Boolean(ticket.slaIncumplido) || elapsedHours > (ticket.slaLimiteHoras || 24),
            createdAt,
            supervisor: 'Supervisor SST',
            message: ticket.instrucciones || `Ticket correctivo #${ticket.ticketNumber || ticket.id} requiere seguimiento.`
        };
    }

    function normalizeCriticality(value) {
        const normalized = normalizeText(value);
        if (normalized.includes('critico') || normalized.includes('critical')) return 'CRITICAL';
        if (normalized.includes('importante') || normalized.includes('alto')) return 'HIGH';
        if (normalized.includes('moderado') || normalized.includes('medio')) return 'MEDIUM';
        return 'LOW';
    }

    function buildOperationalIncident(ticket) {
        const createdAt = ticket.fechaCreacion || new Date().toISOString().split('T')[0];
        const closed = isClosedStatus(ticket.estado);
        const resolutionHours = closed && ticket.fechaCierre
            ? Math.max(0, Math.round((new Date(ticket.fechaCierre) - new Date(createdAt)) / 36e5))
            : null;

        return {
            id: `INC-COR-${ticket.id}`,
            monthly_report_id: null,
            date: createdAt,
            section: ticket.sector || '-',
            incident_type: ticket.tipoRiesgo || '-',
            description: ticket.instrucciones || `Ticket correctivo #${ticket.ticketNumber || ticket.id} requiere seguimiento.`,
            resolved: closed,
            closing_date: closed ? (ticket.fechaCierre || null) : null,
            resolution_time_hours: resolutionHours,
            criticality: normalizeCriticality(ticket.nivelCriticidad),
            operator_id: ticket.tecnicoAsignadoId ? `OP_${String(ticket.tecnicoAsignadoId).padStart(3, '0')}` : null
        };
    }

    function incidentDataChanged(existing, incident) {
        return [
            'section', 'incident_type', 'description', 'resolved',
            'closing_date', 'resolution_time_hours', 'criticality', 'operator_id'
        ].some(field => existing[field] !== incident[field]);
    }

    async function syncOperationalIncidents() {
        const generatedIncidents = ticketAccionCorrectivaStore.tickets.map(buildOperationalIncident);
        const generatedById = new Map(generatedIncidents.map(incident => [incident.id, incident]));
        const existingById = new Map(incidents.value.map(incident => [incident.id, incident]));
        const staleOperationalIncidents = incidents.value.filter(incident =>
            String(incident.id).startsWith('INC-COR-') && !generatedById.has(incident.id)
        );

        for (const incident of staleOperationalIncidents) {
            try {
                await api.deleteIncident(incident.id);
            } catch (error) {
            }
        }
        if (staleOperationalIncidents.length) {
            const staleIds = new Set(staleOperationalIncidents.map(incident => incident.id));
            incidents.value = incidents.value.filter(incident => !staleIds.has(incident.id));
        }

        const createdIncidents = [];
        const updatedIncidents = [];

        for (const incident of generatedIncidents) {
            const existing = existingById.get(incident.id);
            if (!existing) {
                try {
                    createdIncidents.push(await api.createIncident(incident));
                } catch (error) {
                    incidents.value.push(incident);
                }
            } else if (incidentDataChanged(existing, incident)) {
                try {
                    updatedIncidents.push(await api.updateIncident(incident));
                } catch (error) {
                }
            }
        }

        if (createdIncidents.length) incidents.value.push(...createdIncidents);
        for (const updated of updatedIncidents) {
            const index = incidents.value.findIndex(incident => incident.id === updated.id);
            if (index !== -1) incidents.value[index] = updated;
        }
    }

    function buildOperationalAlert(ticket) {
        if (isClosedStatus(ticket.status)) return null;

        const isSlaBreach = ticket.slaBreached || ticket.elapsedHours >= 48;
        const isCritical = isCriticalRisk(ticket.riskLevel) || isCriticalRisk(ticket.riskType);
        if (!isSlaBreach && !isCritical) return null;

        return {
            id: `OP-${ticket.id}`,
            creation_date: ticket.createdAt,
            type: isSlaBreach ? 'CRITICAL' : 'ALERT',
            sector: ticket.sector,
            risk_type: ticket.riskType,
            elapsed_hours: ticket.elapsedHours,
            time_label: ticket.timeLabel,
            responsible_supervisor: ticket.supervisor,
            status: 'unresolved',
            message: isSlaBreach
                ? `Escalamiento automatico: ${ticket.riskType} en ${ticket.sector} tiene SLA incumplido.`
                : `Alerta critica: ${ticket.riskType} en ${ticket.sector} requiere decision administrativa.`,
            read: false,
            source_ticket_id: ticket.sourceId,
            source_module: ticket.source
        };
    }

    function buildOperationalKpis() {
        const activeCount = operationalTickets.value.filter(ticket => isActiveStatus(ticket.status)).length;
        const resolvedCount = operationalTickets.value.filter(ticket => isClosedStatus(ticket.status)).length;
        const criticalSectorCount = new Set(
            criticalAlerts.value
                .filter(alert => alert.status === 'unresolved' || alert.status === 'in_review')
                .map(alert => alert.sector)
        ).size;
        const compliance = annualOHSPlan.value?.global_compliance ?? annualOHSPlan.value?.compliance ?? 0;

        const base = [
            { id: 'KPI_001', name: 'active_incidents', value: activeCount, goal: 0, status: activeCount === 0 ? 'optimal' : 'alert', update_date: new Date().toISOString() },
            { id: 'KPI_002', name: 'resolved_incidents', value: resolvedCount, goal: Math.max(10, resolvedCount), status: resolvedCount >= 10 ? 'optimal' : 'alert', update_date: new Date().toISOString() },
            { id: 'KPI_003', name: 'critical_sectors', value: criticalSectorCount, goal: 0, status: criticalSectorCount === 0 ? 'optimal' : criticalSectorCount <= 2 ? 'alert' : 'danger', update_date: new Date().toISOString() },
            { id: 'KPI_004', name: 'ohs_plan_compliance', value: compliance, goal: 80, status: compliance >= 80 ? 'optimal' : compliance >= 50 ? 'alert' : 'danger', update_date: new Date().toISOString() }
        ];

        return kpiDashboard.value.length
            ? kpiDashboard.value.map(kpi => base.find(item => item.name === kpi.name) || kpi)
            : base;
    }

    function buildOperationalPredictiveIndicator() {
        const tickets = operationalTickets.value;
        const activeTickets = tickets.filter(ticket => isActiveStatus(ticket.status));
        const resolvedTickets = tickets.filter(ticket => isClosedStatus(ticket.status));
        const sectorsMap = activeTickets.reduce((acc, ticket) => {
            if (!acc[ticket.sector]) acc[ticket.sector] = { sector: ticket.sector, events: 0, maxElapsed: 0 };
            acc[ticket.sector].events += 1;
            acc[ticket.sector].maxElapsed = Math.max(acc[ticket.sector].maxElapsed, ticket.elapsedHours);
            return acc;
        }, {});
        const typeMap = tickets.reduce((acc, ticket) => {
            const key = ticket.riskType || 'Sin tipo';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const avgResolution = resolvedTickets.length
            ? Math.round(resolvedTickets.reduce((sum, ticket) => sum + ticket.elapsedHours, 0) / resolvedTickets.length)
            : Math.round((activeTickets.reduce((sum, ticket) => sum + ticket.elapsedHours, 0) / Math.max(activeTickets.length, 1)) || 0);

        return {
            id: 'LIVE_SUPERVISOR_FLOW',
            calculation_date: new Date().toISOString(),
            period_days: 30,
            total_incidents: tickets.length,
            previous_month_variation: Math.max(0, activeTickets.length * 10),
            average_resolution_time_hours: avgResolution,
            resolution_goal_hours: 24,
            sectors_with_increasing_trend: Object.values(sectorsMap)
                .filter(item => item.events > 0)
                .map(item => ({
                    sector: item.sector,
                    events: item.events,
                    variation_percentage: Math.max(10, Math.min(99, item.events * 15 + Math.round(item.maxElapsed / 8))),
                    status: item.maxElapsed >= 48 || item.events >= 3 ? 'critical' : 'alert'
                })),
            recurring_incident_types: Object.entries(typeMap).map(([type, count]) => ({
                type,
                count,
                percentage: tickets.length ? Math.round((count / tickets.length) * 100) : 0,
                trend: count >= 2 ? 'increasing' : 'stable'
            })),
            resolution_time_by_type: []
        };
    }

    function buildOperationalTrends() {
        const grouped = operationalTickets.value.reduce((acc, ticket) => {
            const date = new Date(ticket.createdAt);
            const month = Number.isNaN(date.getTime()) ? new Date().getMonth() + 1 : date.getMonth() + 1;
            const year = Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
            const key = `${year}-${month}`;

            if (!acc[key]) {
                acc[key] = {
                    id: `TREND_${year}_${String(month).padStart(2, '0')}`,
                    month,
                    year,
                    total_incidents: 0,
                    incidents_by_type: {},
                    incidents_by_sector: {}
                };
            }

            acc[key].total_incidents += 1;
            acc[key].incidents_by_type[ticket.riskType] = (acc[key].incidents_by_type[ticket.riskType] || 0) + 1;
            acc[key].incidents_by_sector[ticket.sector] = (acc[key].incidents_by_sector[ticket.sector] || 0) + 1;
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => a.year - b.year || a.month - b.month);
    }

    function buildOperationalOHSPlan(basePlan = annualOHSPlan.value) {
        const tickets = operationalTickets.value;
        const currentYear = new Date().getFullYear();
        const totalActivities = tickets.length;
        const completedActivities = tickets.filter(ticket => isClosedStatus(ticket.status)).length;
        const globalCompliance = totalActivities ? Math.round((completedActivities / totalActivities) * 100) : 0;
        const monthlyMap = tickets.reduce((acc, ticket) => {
            const date = new Date(ticket.createdAt);
            const month = Number.isNaN(date.getTime()) ? new Date().getMonth() + 1 : date.getMonth() + 1;
            if (!acc[month]) acc[month] = { month, completed_activities: 0, planned_activities: 0 };
            acc[month].planned_activities += 1;
            if (isClosedStatus(ticket.status)) acc[month].completed_activities += 1;
            return acc;
        }, {});
        const sectorMap = tickets.reduce((acc, ticket) => {
            if (!acc[ticket.sector]) {
                acc[ticket.sector] = { sector: ticket.sector, completed_activities: 0, planned_activities: 0 };
            }
            acc[ticket.sector].planned_activities += 1;
            if (isClosedStatus(ticket.status)) acc[ticket.sector].completed_activities += 1;
            return acc;
        }, {});
        const monthlyDetails = Object.values(monthlyMap)
            .sort((a, b) => a.month - b.month)
            .map(month => {
                const compliance = month.planned_activities
                    ? Math.round((month.completed_activities / month.planned_activities) * 100)
                    : 0;
                return {
                    ...month,
                    compliance,
                    status: compliance >= 80 ? 'optimal' : compliance >= 50 ? 'acceptable' : 'critical'
                };
            });
        const detailsBySector = Object.values(sectorMap)
            .sort((a, b) => a.sector.localeCompare(b.sector))
            .map(sector => ({
                ...sector,
                compliance: sector.planned_activities
                    ? Math.round((sector.completed_activities / sector.planned_activities) * 100)
                    : 0
            }));

        return {
            ...(basePlan || {}),
            id: basePlan?.id || `PLAN_${currentYear}`,
            year: basePlan?.year || currentYear,
            global_compliance: globalCompliance,
            goal: basePlan?.goal || 80,
            completed_activities: completedActivities,
            total_activities: totalActivities,
            critical_months: monthlyDetails.filter(month => month.compliance < 50).length,
            update_date: new Date().toISOString(),
            monthly_details: monthlyDetails,
            details_by_sector: detailsBySector,
            next_review: basePlan?.next_review || null
        };
    }

    async function syncOperationalAlerts() {
        const generatedAlerts = operationalTickets.value
            .map(ticket => buildOperationalAlert(ticket))
            .filter(Boolean);
        const generatedIds = new Set(generatedAlerts.map(alert => alert.id));
        const staleOperationalAlerts = criticalAlerts.value.filter(alert =>
            String(alert.id).startsWith('OP-') && !generatedIds.has(alert.id)
        );
        const existingIds = new Set(criticalAlerts.value.map(alert => alert.id));
        const createdAlerts = [];

        for (const alert of staleOperationalAlerts) {
            try {
                await api.deleteCriticalAlert(alert.id);
            } catch (error) {
            }
        }

        if (staleOperationalAlerts.length) {
            const staleIds = new Set(staleOperationalAlerts.map(alert => alert.id));
            criticalAlerts.value = criticalAlerts.value.filter(alert => !staleIds.has(alert.id));
        }

        for (const alert of generatedAlerts) {
            if (!existingIds.has(alert.id)) {
                try {
                    createdAlerts.push(await api.createCriticalAlert(alert));
                } catch (error) {
                    criticalAlerts.value.push(alert);
                }
            }
        }

        if (createdAlerts.length) {
            criticalAlerts.value.push(...createdAlerts);
        }
    }

    function syncOperationalInsights() {
        if (!operationalTickets.value.length) return;

        annualOHSPlan.value = buildOperationalOHSPlan();
        kpiDashboard.value = buildOperationalKpis();
        const liveIndicator = buildOperationalPredictiveIndicator();
        predictiveIndicators.value = [liveIndicator];
        historicalTrends.value = buildOperationalTrends();
        syncKPIs();
    }

    function syncKPIs() {
        if (!kpiDashboard.value.length) return;

        const hasOperationalTickets = operationalTickets.value.length > 0;
        const activeCount = hasOperationalTickets
            ? operationalTickets.value.filter(ticket => isActiveStatus(ticket.status)).length
            : incidents.value.filter(i => !i.resolved).length;
        const resolvedCount = hasOperationalTickets
            ? operationalTickets.value.filter(ticket => isClosedStatus(ticket.status)).length
            : incidents.value.filter(i => i.resolved).length;
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
        } catch (error) {
            errorMonthlyReports.value = error.message;
        } finally {
            loadingMonthlyReports.value = false;
        }
    }
    async function fetchMonthlyReportById(id) {
        loadingMonthlyReports.value = true;
        errorMonthlyReports.value = null;

        try {
            currentMonthlyReport.value = await api.getMonthlyReportById(id);
        } catch (error) {
            errorMonthlyReports.value = error.message;
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

            return newReport;
        } catch (error) {
            errorMonthlyReports.value = error.message;
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
        } catch (error) {
            errorGeneratedReports.value = error.message;
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
        } catch (error) {
            errorGeneratedReports.value = error.message;
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

            return newReport;
        } catch (error) {
            errorGeneratedReports.value = error.message;
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
        } catch (error) {
            errorGeneratedReports.value = error.message;
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
            if (!ticketAccionCorrectivaStore.loaded) await ticketAccionCorrectivaStore.fetchAll();
            await syncOperationalIncidents();
        } catch (error) {
            errorIncidents.value = error.message;
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

            return updatedIncident;
        } catch (error) {
            errorIncidents.value = error.message;
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
            if (!ticketAccionCorrectivaStore.loaded) {
                await ticketAccionCorrectivaStore.fetchAll();
            }
            if (operationalTickets.value.length) {
                annualOHSPlan.value = buildOperationalOHSPlan(annualOHSPlan.value);
            }
            syncKPIs();
        } catch (error) {
            errorAnnualOHSPlan.value = error.message;
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

            return annualOHSPlan.value;
        } catch (error) {
            errorAnnualOHSPlan.value = error.message;
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
            syncOperationalInsights();
        } catch (error) {
            errorPredictiveIndicators.value = error.message;
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
            await syncOperationalAlerts();
            syncOperationalInsights();
        } catch (error) {
            errorCriticalAlerts.value = error.message;
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

            return updatedAlert;
        } catch (error) {
            errorCriticalAlerts.value = error.message;
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
        } catch (error) {
            errorCriticalAlerts.value = error.message;
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
            syncOperationalInsights();
        } catch (error) {
            errorKPI.value = error.message;
        } finally {
            loadingKPI.value = false;
        }
    }

    async function fetchHistoricalTrends() {
        loadingHistoricalTrends.value = true;
        errorHistoricalTrends.value = null;

        try {
            const trends = await api.getHistoricalTrends();
            if (!ticketAccionCorrectivaStore.loaded) {
                await ticketAccionCorrectivaStore.fetchAll();
            }
            historicalTrends.value = correctiveTickets.value.length
                ? buildOperationalTrends()
                : trends;
        } catch (error) {
            errorHistoricalTrends.value = error.message;
        } finally {
            loadingHistoricalTrends.value = false;
        }
    }

    async function fetchOperationalData() {
        loadingOperationalData.value = true;
        errorOperationalData.value = null;

        try {
            const [supervisor] = await Promise.all([
                api.getSupervisorTickets(),
                ticketAccionCorrectivaStore.fetchAll()
            ]);
            supervisorTickets.value = supervisor;

            if (!criticalAlerts.value.length) {
                try {
                    criticalAlerts.value = await api.getCriticalAlerts();
                } catch {
                    criticalAlerts.value = [];
                }
            }
            if (!incidents.value.length) {
                try {
                    incidents.value = await api.getIncidents();
                } catch {
                    incidents.value = [];
                }
            }

            await syncOperationalAlerts();
            await syncOperationalIncidents();
            syncOperationalInsights();
        } catch (error) {
            errorOperationalData.value = error.message;
            throw error;
        } finally {
            loadingOperationalData.value = false;
        }
    }

    return {
        monthlyReports, currentMonthlyReport, loadingMonthlyReports, errorMonthlyReports,
        generatedReports, currentGeneratedReport, loadingGeneratedReports, errorGeneratedReports,
        incidents, loadingIncidents, errorIncidents,
        annualOHSPlan, loadingAnnualOHSPlan, errorAnnualOHSPlan,
        predictiveIndicators, loadingPredictiveIndicators, errorPredictiveIndicators,
        criticalAlerts, loadingCriticalAlerts, errorCriticalAlerts,
        supervisorTickets, correctiveTickets, loadingOperationalData, errorOperationalData,
        kpiDashboard, loadingKPI, errorKPI,
        historicalTrends, loadingHistoricalTrends, errorHistoricalTrends,
        isLoading, unresolvedCriticalAlerts, activeIncidents, resolvedIncidents, operationalTickets,
        fetchMonthlyReports, fetchMonthlyReportById, createMonthlyReport,
        fetchGeneratedReports, fetchGeneratedReportById, createGeneratedReport, deleteGeneratedReport,
        fetchIncidents, updateIncident,
        fetchAnnualOHSPlan, updateAnnualOHSPlan,
        fetchPredictiveIndicators, fetchOperationalData,
        fetchCriticalAlerts, updateCriticalAlert, deleteCriticalAlert,
        fetchKPIDashboard, fetchHistoricalTrends, syncKPIs
    };
});
