import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/shared/presentation/components/layout.vue'
import Login from '@/identity-access/presentation/views/login.vue'
import identityAccessRoutes from '@/identity-access/presentation/identity-access-routes.js'
import siteRoutes from '@/site/presentation/site-routes.js'
import areaRoutes from '@/area/presentation/area-routes.js'
import assetRoutes from '@/asset/presentation/asset-routes.js'
import inspectionRoutes from '@/inspection/presentation/inspection-routes.js'
import riskAssessmentRoutes from '@/risk-assessment/presentation/risk-assessment-routes.js'
import patronRiesgoRoutes from '@/risk-assessment/presentation/patron-riesgo-routes.js'
import nivelCriticidadAreaRoutes from '@/risk-assessment/presentation/nivel-criticidad-area-routes.js'
import alertaPatronRoutes from '@/risk-assessment/presentation/alerta-patron-routes.js'
import resumenDiarioRoutes from '@/risk-assessment/presentation/resumen-diario-routes.js'
import mitigationRoutes from '@/mitigation/presentation/mitigation-routes.js'
import ticketRoutes from '@/mitigation/presentation/ticket-accion-correctiva-routes.js'
import verificacionRoutes from '@/mitigation/presentation/verificacion-medida-routes.js'
import historialTicketRoutes from '@/mitigation/presentation/historial-ticket-routes.js'
import alertaSLARoutes from '@/mitigation/presentation/alerta-sla-routes.js'
import notificacionCriticaRoutes from '@/mitigation/presentation/notificacion-critica-routes.js'
import hazardRoutes from '@/hazard/presentation/hazard-routes.js'
import tecnicoRoutes from '@/technician/presentation/tecnico-routes.js'
import monitoringRoutes from '@/monitoring-dashboard/presentation/monitoring-routes.js'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'

const OPERATOR = 'plant-operator'
const SUPERVISOR = 'supervisor'
const ADMINISTRATOR = 'administrator'
const pageNotFound = () => import('@/shared/presentation/views/page-not-found.vue')

export const homeByRole = {
  [OPERATOR]: '/inspection/new',
  [SUPERVISOR]: '/monitoring/dashboard',
  [ADMINISTRATOR]: '/reportes/dashboard'
}

const reportRoutes = [
  { path: 'dashboard', name: 'executive-dashboard', component: () => import('@/reports/presentation/views/executive_dashboard.vue'), meta: { title: 'Dashboard ejecutivo' } },
  { path: 'new', name: 'new-report', component: () => import('@/reports/presentation/views/new_report.vue'), meta: { title: 'Nuevo reporte' } },
  { path: 'list', name: 'reports-list', component: () => import('@/reports/presentation/views/report_list.vue'), meta: { title: 'Mis reportes' } },
  { path: 'alerts', name: 'critical-alerts', component: () => import('@/reports/presentation/views/critical_alerts.vue'), meta: { title: 'Alertas criticas' } },
  { path: 'sst-plan', name: 'sst-plan-tracking', component: () => import('@/reports/presentation/views/sst_plan_tracking.vue'), meta: { title: 'Plan SST' } },
  { path: 'predictive-indicators', name: 'predictive-indicators', component: () => import('@/reports/presentation/views/predective_indicators.vue'), meta: { title: 'Indicadores predictivos' } },
  { path: 'history', name: 'incident-history', component: () => import('@/reports/presentation/views/incident_history.vue'), meta: { title: 'Historial de incidentes' } }
]

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login', public: true } },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'app-home', redirect: '/login' },
      { path: 'identity-access', children: identityAccessRoutes },
      { path: 'inspection', meta: { roles: [OPERATOR, SUPERVISOR] }, children: inspectionRoutes },
      { path: 'site', meta: { roles: [SUPERVISOR] }, children: siteRoutes },
      { path: 'area', meta: { roles: [SUPERVISOR] }, children: areaRoutes },
      { path: 'asset', meta: { roles: [SUPERVISOR] }, children: assetRoutes },
      {
        path: 'risk-assessment',
        meta: { roles: [SUPERVISOR] },
        children: [...riskAssessmentRoutes, ...patronRiesgoRoutes, ...nivelCriticidadAreaRoutes, ...alertaPatronRoutes, ...resumenDiarioRoutes]
      },
      {
        path: 'mitigation',
        meta: { roles: [SUPERVISOR] },
        children: [...mitigationRoutes, ...ticketRoutes, ...verificacionRoutes, ...historialTicketRoutes, ...alertaSLARoutes, ...notificacionCriticaRoutes]
      },
      { path: 'hazard', meta: { roles: [SUPERVISOR] }, children: hazardRoutes },
      { path: 'technician', meta: { roles: [SUPERVISOR] }, children: tecnicoRoutes },
      { path: 'monitoring', meta: { roles: [SUPERVISOR] }, children: monitoringRoutes },
      { path: 'reportes', meta: { roles: [ADMINISTRATOR] }, children: reportRoutes },
      { path: ':pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Pagina no encontrada' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const store = useIdentityAccessStore()
  document.title = `RiskGuard - ${to.meta.title || 'Seguridad Industrial'}`

  if (to.meta.public) {
    if (to.name === 'login' && store.currentUser) return homeByRole[store.currentRole?.code] || '/'
    return true
  }

  if (!store.currentUser) return { path: '/login', query: { redirect: to.fullPath } }
  if (!store.rolesLoaded) await store.fetchRoles()

  const roleCode = store.currentRole?.code
  if (to.meta.roles && !to.meta.roles.includes(roleCode)) return homeByRole[roleCode] || '/login'
  return true
})

export default router
