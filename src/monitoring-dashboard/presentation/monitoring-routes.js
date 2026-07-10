const dashboard = () => import('./views/dashboard.vue')
const ticketList = () => import('./views/ticket-list.vue')
const ticketAssignment = () => import('./views/ticket-assignment.vue')
const maintenance = () => import('./views/maintenance.vue')
const assetForm = () => import('./views/asset-form.vue')
const assetMaintenance = () => import('./views/asset-maintenance.vue')
const assetReactivation = () => import('./views/asset-reactivation.vue')
const reports = () => import('./views/reports.vue')
const sectorMap = () => import('./views/sector-map.vue')
const sectorForm = () => import('./views/sector-form.vue')
const technicianDirectory = () => import('./views/technician-directory.vue')
const technicianForm = () => import('./views/technician-form.vue')

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
  { path: 'sectors/new', name: 'monitoring-sectors-new', component: sectorForm, meta: { title: 'New Sector' } },
  { path: 'sectors/:id', name: 'monitoring-sectors-detail', component: sectorForm, meta: { title: 'Sector Detail' } },
  { path: 'sectors', name: 'monitoring-sectors', component: sectorMap, meta: { title: 'Sector Map' } },
  { path: 'technicians/new', name: 'monitoring-technicians-new', component: technicianForm, meta: { title: 'New Technician' } },
  { path: 'technicians/:id', name: 'monitoring-technicians-detail', component: technicianForm, meta: { title: 'Technician Detail' } },
  { path: 'technicians', name: 'monitoring-technicians', component: technicianDirectory, meta: { title: 'Technical Directory' } },
  { path: 'reports', name: 'monitoring-reports', component: reports, meta: { title: 'Reports' } }
]

export default monitoringRoutes
