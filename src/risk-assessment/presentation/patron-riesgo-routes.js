export default [
    { path: 'patrones',         name: 'patron-riesgo-list',   component: () => import('./views/patron-riesgo-list.vue'),  meta: { title: 'Patrones de Riesgo' } },
    { path: 'patrones/:id',     name: 'patron-riesgo-detail', component: () => import('./views/patron-riesgo-detail.vue'), meta: { title: 'Detalle Patrón' } }
]
