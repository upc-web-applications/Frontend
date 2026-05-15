import { createRouter, createWebHistory } from 'vue-router';
import Layout from "@/shared/presentation/components/layout.vue";

const pageNotFound = () => import("@/shared/presentation/views/page-not-found.vue");
const executiveDashboard = () => import("@/reports/presentation/views/executive_dashboard.vue");
const newReport = () => import("@/reports/presentation/views/new_report.vue");
const reportsList = () => import("@/reports/presentation/views/report_list.vue");
const criticalAlerts = () => import("@/reports/presentation/views/critical_alerts.vue");
const sstPlanTracking = () => import("@/reports/presentation/views/sst_plan_tracking.vue");
const predictiveIndicators = () => import("@/reports/presentation/views/predective_indicators.vue");
const incidentHistory = () => import("@/reports/presentation/views/incident_history.vue");

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                name: 'home',
                component: executiveDashboard,
                meta: { title: 'Executive Dashboard' }
            },
            {
                path: 'reportes/new',
                name: 'new-report',
                component: newReport,
                meta: { title: 'New Report' }
            },
            {
                path: 'reportes/list',
                name: 'reports-list',
                component: reportsList,
                meta: { title: 'My Reports' }
            },
            {
                path: 'reportes/dashboard',
                name: 'executive-dashboard',
                component: executiveDashboard,
                meta: { title: 'Executive Dashboard' }
            },
            {
                path: 'reportes/alerts',
                name: 'critical-alerts',
                component: criticalAlerts,
                meta: { title: 'Critical Alerts' }
            },
            {
                path: 'reportes/sst-plan',
                name: 'sst-plan-tracking',
                component: sstPlanTracking,
                meta: { title: 'SST Plan Tracking' }
            },
            {
                path: 'reportes/predictive-indicators',
                name: 'predictive-indicators',
                component: predictiveIndicators,
                meta: { title: 'Predictive Indicators' }
            },
            {
                path: 'reportes/history',
                name: 'incident-history',
                component: incidentHistory,
                meta: { title: 'Incident History' }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: pageNotFound,
        meta: { title: 'Page Not Found' }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'RiskGuard';
    document.title = `${baseTitle} - ${to.meta['title'] || 'Plant OPS'}`;
});

export default router;