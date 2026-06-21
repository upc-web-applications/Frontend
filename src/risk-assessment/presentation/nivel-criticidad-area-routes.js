export default [
    { path: 'mapa-calor',       name: 'nivel-criticidad-area-list',   component: () => import('./views/nivel-criticidad-area-list.vue'),  meta: { title: 'Mapa de Calor' } },
    { path: 'mapa-calor/:id',   name: 'nivel-criticidad-area-detail', component: () => import('./views/nivel-criticidad-area-detail.vue'), meta: { title: 'Detalle Área' } }
]
