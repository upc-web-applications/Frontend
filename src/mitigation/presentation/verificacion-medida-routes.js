export default [
    { path: 'verificaciones',           name: 'verificacion-list',   component: () => import('./views/verificacion-medida-list.vue'),  meta: { title: 'Verificaciones' } },
    { path: 'verificaciones/new',       name: 'verificacion-new',    component: () => import('./views/verificacion-medida-form.vue'),   meta: { title: 'Nueva Verificación' } },
    { path: 'verificaciones/:id',       name: 'verificacion-detail', component: () => import('./views/verificacion-medida-detail.vue'), meta: { title: 'Detalle Verificación' } }
]
