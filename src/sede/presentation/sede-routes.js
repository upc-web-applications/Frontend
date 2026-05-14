export default [
    { path: 'list',     name: 'sede-list', component: () => import('./views/sede-list.vue'),  meta: { title: 'Sedes' } },
    { path: 'new',      name: 'sede-new',  component: () => import('./views/sede-form.vue'),   meta: { title: 'Nueva Sede' } },
    { path: ':id/edit', name: 'sede-edit', component: () => import('./views/sede-form.vue'),   meta: { title: 'Editar Sede' } },
    { path: ':id',      name: 'sede-detail', component: () => import('./views/sede-detail.vue'), meta: { title: 'Detalle Sede' } }
]
