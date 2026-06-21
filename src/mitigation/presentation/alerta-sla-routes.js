export default [
    { path: 'alertas-sla',          name: 'alerta-sla-list',   component: () => import('./views/alerta-sla-list.vue'),  meta: { title: 'Alertas SLA' } },
    { path: 'alertas-sla/:id',      name: 'alerta-sla-detail', component: () => import('./views/alerta-sla-detail.vue'), meta: { title: 'Detalle Alerta SLA' } }
]
