/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export default [
    { path: 'list',     name: 'mitigation-list',   component: () => import('./views/mitigation-list.vue'),   meta: { title: 'Mitigaciones' } },
    { path: 'new',      name: 'mitigation-new',    component: () => import('./views/mitigation-form.vue'),    meta: { title: 'Nueva Mitigación' } },
    { path: ':id/edit', name: 'mitigation-edit',   component: () => import('./views/mitigation-form.vue'),    meta: { title: 'Editar Mitigación' } },
    { path: ':id',      name: 'mitigation-detail', component: () => import('./views/mitigation-detail.vue'),  meta: { title: 'Detalle Mitigación' } }
]
