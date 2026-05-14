/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export default [
    { path: 'list',     name: 'risk-assessment-list',   component: () => import('./views/risk-assessment-list.vue'),   meta: { title: 'Evaluaciones de Riesgo' } },
    { path: 'new',      name: 'risk-assessment-new',    component: () => import('./views/risk-assessment-form.vue'),  meta: { title: 'Nueva Evaluación' } },
    { path: ':id/edit', name: 'risk-assessment-edit',   component: () => import('./views/risk-assessment-form.vue'),  meta: { title: 'Editar Evaluación' } },
    { path: ':id',      name: 'risk-assessment-detail', component: () => import('./views/risk-assessment-detail.vue'), meta: { title: 'Detalle Evaluación' } }
]
