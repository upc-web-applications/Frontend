/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export default [
    { path: 'list',     name: 'asset-list',   component: () => import('./views/asset-list.vue'),   meta: { title: 'Activos' } },
    { path: 'new',      name: 'asset-new',    component: () => import('./views/asset-form.vue'),    meta: { title: 'Nuevo Activo' } },
    { path: ':id/edit', name: 'asset-edit',   component: () => import('./views/asset-form.vue'),    meta: { title: 'Editar Activo' } },
    { path: ':id',      name: 'asset-detail', component: () => import('./views/asset-detail.vue'),  meta: { title: 'Detalle Activo' } }
]
