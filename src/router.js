import { createRouter, createWebHistory } from 'vue-router'
import monitoringRoutes from '@/monitoring-dashboard/presentation/monitoring-routes.js'

const pageNotFound = () => import('@/shared/presentation/views/page-not-found.vue')

const routes = [
  { path: '/monitoring', name: 'monitoring', children: monitoringRoutes },
  { path: '/', redirect: '/monitoring/dashboard' },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach((to, from, next) => {
  const baseTitle = 'RiskGuard'
  document.title = `${baseTitle} - ${to.meta['title']}`
  return next()
})

export default router
