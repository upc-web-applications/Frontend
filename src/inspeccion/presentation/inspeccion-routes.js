export default [
    { path: 'list', name: 'inspeccion-list', component: () => import('./views/inspeccion-list.vue'), meta: { title: 'Inspecciones' } },
    { path: 'new',  name: 'inspeccion-new',  component: () => import('./views/inspeccion-form.vue'), meta: { title: 'Nueva Inspección' } },
    { path: ':id',  name: 'inspeccion-detail', component: () => import('./views/inspeccion-detail.vue'), meta: { title: 'Detalle Inspección' } }
]
