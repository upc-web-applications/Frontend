/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export default [
    { path: 'list',     name: 'area-list',   component: () => import('./views/area-list.vue'),   meta: { title: 'Areas' } },
    { path: 'new',      name: 'area-new',    component: () => import('./views/area-form.vue'),    meta: { title: 'Nueva Area' } },
    { path: ':id/edit', name: 'area-edit',   component: () => import('./views/area-form.vue'),    meta: { title: 'Editar Area' } },
    { path: ':id',      name: 'area-detail', component: () => import('./views/area-detail.vue'),  meta: { title: 'Detalle Area' } }
]
