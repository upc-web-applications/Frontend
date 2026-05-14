import { createRouter, createWebHistory } from 'vue-router'
import sedeRoutes     from '@/sede/presentation/sede-routes.js'
import areaRoutes     from '@/area/presentation/area-routes.js'
import activoRoutes   from '@/activo/presentation/activo-routes.js'
import inspeccionRoutes from '@/inspeccion/presentation/inspeccion-routes.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/sede/list' },
        { path: '/sede',       children: sedeRoutes },
        { path: '/area',       children: areaRoutes },
        { path: '/activo',     children: activoRoutes },
        { path: '/inspeccion', children: inspeccionRoutes },
        { path: '/:pathMatch(.*)*', redirect: '/sede/list' }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = `RiskGuard — ${to.meta.title ?? 'Seguridad Industrial'}`
    next()
})

export default router
