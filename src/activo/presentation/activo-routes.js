export default [
    { path: 'list',     name: 'activo-list',   component: () => import('./views/activo-list.vue'),   meta: { title: 'Activos' } },
    { path: 'new',      name: 'activo-new',    component: () => import('./views/activo-form.vue'),    meta: { title: 'Nuevo Activo' } },
    { path: ':id/edit', name: 'activo-edit',   component: () => import('./views/activo-form.vue'),    meta: { title: 'Editar Activo' } },
    { path: ':id',      name: 'activo-detail', component: () => import('./views/activo-detail.vue'),  meta: { title: 'Detalle Activo' } }
]
