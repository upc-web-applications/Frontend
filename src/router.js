/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import { createRouter, createWebHistory } from 'vue-router'
import riskAssessmentRoutes from '@/risk-assessment/presentation/risk-assessment-routes.js'
import mitigationRoutes from '@/mitigation/presentation/mitigation-routes.js'
import hazardRoutes from '@/hazard/presentation/hazard-routes.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/risk-assessment/list' },
        { path: '/risk-assessment', children: riskAssessmentRoutes },
        { path: '/mitigation',     children: mitigationRoutes },
        { path: '/hazard',         children: hazardRoutes },
        { path: '/:pathMatch(.*)*', redirect: '/risk-assessment/list' }
    ]
})

router.beforeEach((to) => {
    document.title = `RiskGuard — ${to.meta.title ?? 'Seguridad Industrial'}`
})

export default router
