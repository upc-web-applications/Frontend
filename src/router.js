import { createRouter, createWebHistory } from 'vue-router'
import riskAssessmentRoutes from '@/risk-assessment/presentation/risk-assessment-routes.js'
import patronRiesgoRoutes from '@/risk-assessment/presentation/patron-riesgo-routes.js'
import nivelCriticidadAreaRoutes from '@/risk-assessment/presentation/nivel-criticidad-area-routes.js'
import alertaPatronRoutes from '@/risk-assessment/presentation/alerta-patron-routes.js'
import resumenDiarioRoutes from '@/risk-assessment/presentation/resumen-diario-routes.js'
import mitigationRoutes from '@/mitigation/presentation/mitigation-routes.js'
import ticketRoutes from '@/mitigation/presentation/ticket-accion-correctiva-routes.js'
import verificacionRoutes from '@/mitigation/presentation/verificacion-medida-routes.js'
import historialTicketRoutes from '@/mitigation/presentation/historial-ticket-routes.js'
import alertaSLARoutes from '@/mitigation/presentation/alerta-sla-routes.js'
import notificacionCriticaRoutes from '@/mitigation/presentation/notificacion-critica-routes.js'
import hazardRoutes from '@/hazard/presentation/hazard-routes.js'
import tecnicoRoutes from '@/technician/presentation/tecnico-routes.js'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/risk-assessment/list' },
        { path: '/risk-assessment', children: [
            ...riskAssessmentRoutes,
            ...patronRiesgoRoutes,
            ...nivelCriticidadAreaRoutes,
            ...alertaPatronRoutes,
            ...resumenDiarioRoutes
        ]},
        { path: '/mitigation', children: [
            ...mitigationRoutes,
            ...ticketRoutes,
            ...verificacionRoutes,
            ...historialTicketRoutes,
            ...alertaSLARoutes,
            ...notificacionCriticaRoutes
        ]},
        { path: '/hazard', children: hazardRoutes },
        { path: '/technician', children: tecnicoRoutes },
        { path: '/:pathMatch(.*)*', redirect: '/risk-assessment/list' }
    ]
})

router.beforeEach((to) => {
    document.title = `RiskGuard — ${to.meta.title ?? 'Seguridad Industrial'}`
})

export default router
