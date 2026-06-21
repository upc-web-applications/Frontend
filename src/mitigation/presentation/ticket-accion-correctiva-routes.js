export default [
    { path: 'tickets',          name: 'ticket-list',    component: () => import('./views/ticket-accion-correctiva-list.vue'),  meta: { title: 'Tickets Correctivos' } },
    { path: 'tickets/new',      name: 'ticket-new',     component: () => import('./views/ticket-accion-correctiva-form.vue'),   meta: { title: 'Nuevo Ticket' } },
    { path: 'tickets/:id/edit', name: 'ticket-edit',    component: () => import('./views/ticket-accion-correctiva-form.vue'),   meta: { title: 'Editar Ticket' } },
    { path: 'tickets/:id',      name: 'ticket-detail',  component: () => import('./views/ticket-accion-correctiva-detail.vue'), meta: { title: 'Detalle Ticket' } }
]
