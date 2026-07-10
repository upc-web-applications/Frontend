export default [
    { path: 'notificaciones-criticas',          name: 'notificacion-critica-list',   component: () => import('./views/notificacion-critica-list.vue'),  meta: { title: 'Notificaciones Criticas' } },
    { path: 'notificaciones-criticas/:id',      name: 'notificacion-critica-detail', component: () => import('./views/notificacion-critica-detail.vue'), meta: { title: 'Detalle Notificacion' } }
]
