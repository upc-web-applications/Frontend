const dashboard = () => import('./views/dashboard.vue')
const ticketList = () => import('./views/ticket-list.vue')
const ticketAssignment = () => import('./views/ticket-assignment.vue')
const maintenance = () => import('./views/maintenance.vue')
const assetForm = () => import('./views/asset-form.vue')
const assetMaintenance = () => import('./views/asset-maintenance.vue')
const assetReactivation = () => import('./views/asset-reactivation.vue')
const reports = () => import('./views/reports.vue')

const monitoringRoutes = [
  { path: 'dashboard', name: 'monitoring-dashboard', component: dashboard, meta: { title: 'Dashboard' } },
  { path: 'tickets', name: 'monitoring-tickets', redirect: '/mitigation/tickets' },
  { path: 'tickets/:id/assign', name: 'monitoring-ticket-assign', redirect: to => `/mitigation/tickets/${to.params.id}/edit` },
  { path: 'tickets/:id/assignment', name: 'monitoring-ticket-assignment', redirect: to => `/mitigation/tickets/${to.params.id}` },
  { path: 'maintenance/assets/new', name: 'monitoring-assets-new', component: assetForm, meta: { title: 'New Asset' } },
  { path: 'maintenance/assets/:id/maintenance', name: 'monitoring-assets-maintenance', component: assetMaintenance, meta: { title: 'Asset Maintenance' } },
  { path: 'maintenance/assets/:id/reactivate', name: 'monitoring-assets-reactivate', component: assetReactivation, meta: { title: 'Reactivate Asset' } },
  { path: 'maintenance/assets/:id', name: 'monitoring-assets-detail', component: assetForm, meta: { title: 'Asset Detail' } },
  { path: 'maintenance', name: 'monitoring-maintenance', component: maintenance, meta: { title: 'Maintenance' } },
  { path: 'sectors', name: 'monitoring-sectors-legacy', redirect: '/area/list' },
  { path: 'sectors/new', name: 'monitoring-sectors-new-legacy', redirect: '/area/new' },
  { path: 'sectors/:id', name: 'monitoring-sectors-detail-legacy', redirect: to => `/area/${to.params.id}/edit` },
  { path: 'technicians', name: 'monitoring-technicians-legacy', redirect: '/technicians' },
  { path: 'technicians/new', name: 'monitoring-technicians-new-legacy', redirect: '/technicians/new' },
  { path: 'technicians/:id', name: 'monitoring-technicians-detail-legacy', redirect: to => `/technicians/${to.params.id}` },
  { path: 'reports', name: 'monitoring-reports', component: reports, meta: { title: 'Reports' } }
]

export default monitoringRoutes
