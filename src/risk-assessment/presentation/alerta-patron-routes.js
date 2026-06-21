export default [
    { path: 'alertas-patron',       name: 'alerta-patron-list',   component: () => import('./views/alerta-patron-list.vue'),  meta: { title: 'Alertas de Patrón' } },
    { path: 'alertas-patron/:id',   name: 'alerta-patron-detail', component: () => import('./views/alerta-patron-detail.vue'), meta: { title: 'Detalle Alerta' } }
]
