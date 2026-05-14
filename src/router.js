/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
import { createRouter, createWebHistory } from 'vue-router'
import siteRoutes     from '@/site/presentation/site-routes.js'
import areaRoutes     from '@/area/presentation/area-routes.js'
import assetRoutes   from '@/asset/presentation/asset-routes.js'
import inspectionRoutes from '@/inspection/presentation/inspection-routes.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/site/list' },
        { path: '/site',       children: siteRoutes },
        { path: '/area',       children: areaRoutes },
        { path: '/asset',     children: assetRoutes },
        { path: '/inspection', children: inspectionRoutes },
        { path: '/:pathMatch(.*)*', redirect: '/site/list' }
    ]
})

router.beforeEach((to) => {
    document.title = `RiskGuard — ${to.meta.title ?? 'Seguridad Industrial'}`
})

export default router
