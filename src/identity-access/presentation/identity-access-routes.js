const accountPanel = () => import('./views/account-panel.vue')

const identityAccessRoutes = [
  { path: 'panel', name: 'identity-panel', component: accountPanel, meta: { title: 'Panel' } },
  { path: 'account', redirect: '/identity-access/panel' }
]

export default identityAccessRoutes
