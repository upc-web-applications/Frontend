export default [
    { path: '',                 name: 'tecnico-list',   component: () => import('./views/tecnico-list.vue'),   meta: { title: 'Técnicos' } },
    { path: 'new',              name: 'tecnico-new',    component: () => import('./views/tecnico-form.vue'),    meta: { title: 'Nuevo Técnico' } },
    { path: ':id/edit',         name: 'tecnico-edit',   component: () => import('./views/tecnico-form.vue'),    meta: { title: 'Editar Técnico' } },
    { path: ':id',              name: 'tecnico-detail', component: () => import('./views/tecnico-detail.vue'),  meta: { title: 'Detalle Técnico' } }
]
