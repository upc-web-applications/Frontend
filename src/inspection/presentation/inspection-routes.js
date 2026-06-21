/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export default [
    { path: 'list', name: 'inspection-list', component: () => import('./views/inspection-list.vue'), meta: { title: 'Inspecciones' } },
    { path: 'new',  name: 'inspection-new',  component: () => import('./views/inspection-form.vue'), meta: { title: 'Nueva Inspección' } },
    { path: ':id',  name: 'inspection-detail', component: () => import('./views/inspection-detail.vue'), meta: { title: 'Detalle Inspección' } }
]
