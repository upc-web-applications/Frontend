const reportsRoutes = [
    {
        path: 'new',
        name: 'new-report',
        component: () => import('@/reports/presentation/views/new_report.vue'),
        meta: { title: 'New Report' }
    },
    {
        path: 'list',
        name: 'reports-list',
        component: () => import('@/reports/presentation/views/report_list.vue'),
        meta: { title: 'My Reports' }
    },
    {
        path: 'dashboard',
        name: 'executive-dashboard',
        component: () => import('@/reports/presentation/views/executive_dashboard.vue'),
        meta: { title: 'Executive Dashboard' }
    },
    {
        path: 'alerts',
        name: 'critical-alerts',
        component: () => import('@/reportes/presentation/views/critical_alerts.vue'),
        meta: { title: 'Critical Alerts' }
    },
    {
        path: 'sst-plan',
        name: 'sst-plan-tracking',
        component: () => import('@/reportes/presentation/views/sst_plan_tracking.vue'),
        meta: { title: 'SST Plan Tracking' }
    },
    {
        path: 'predictive-indicators',
        name: 'predictive-indicators',
        component: () => import('@/reportes/presentation/views/predective_indicators.vue'),
        meta: { title: 'Predictive Indicators' }
    }
];

export default reportsRoutes;