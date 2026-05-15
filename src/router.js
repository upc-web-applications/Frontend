import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/identity-access/presentation/views/login.vue'
import identityAccessRoutes from '@/identity-access/presentation/identity-access-routes.js'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'

const pageNotFound = () => import('@/shared/presentation/views/page-not-found.vue')

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { title: 'Login', public: true } },
  { path: '/identity-access', name: 'identity-access', redirect: '/identity-access/panel', children: identityAccessRoutes },
  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach((to, from, next) => {
  const baseTitle = 'RiskGuard'
  document.title = `${baseTitle} - ${to.meta['title'] || 'Identity Access'}`
  const store = useIdentityAccessStore()
  if (!to.meta.public && !store.currentUser) {
    return next('/login')
  }
  if (to.name === 'login' && store.currentUser) {
    return next('/identity-access/panel')
  }
  return next()
})

export default router
