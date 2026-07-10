/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export default [
    { path: 'list',     name: 'hazard-list',   component: () => import('./views/hazard-list.vue'),   meta: { title: 'Peligros' } },
    { path: 'new',      name: 'hazard-new',    component: () => import('./views/hazard-form.vue'),    meta: { title: 'Nuevo Peligro' } },
    { path: ':id/edit', name: 'hazard-edit',   component: () => import('./views/hazard-form.vue'),    meta: { title: 'Editar Peligro' } },
    { path: ':id',      name: 'hazard-detail', component: () => import('./views/hazard-detail.vue'),  meta: { title: 'Detalle Peligro' } }
]
