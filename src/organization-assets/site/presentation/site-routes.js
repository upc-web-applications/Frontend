/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export default [
    { path: 'list',     name: 'site-list', component: () => import('./views/site-list.vue'),  meta: { title: 'Sedes' } },
    { path: 'new',      name: 'site-new',  component: () => import('./views/site-form.vue'),   meta: { title: 'Nueva Sede' } },
    { path: ':id/edit', name: 'site-edit', component: () => import('./views/site-form.vue'),   meta: { title: 'Editar Sede' } },
    { path: ':id',      name: 'site-detail', component: () => import('./views/site-detail.vue'), meta: { title: 'Detalle Sede' } }
]
