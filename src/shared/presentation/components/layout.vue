<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'
import FooterContent from '@/shared/presentation/components/footer-content.vue'
import riskguardLogo from '@/assets/riskguard-logo.png'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useIdentityAccessStore()
const sidebarOpen = ref(false)

const navigation = {
  'plant-operator': [
    { to: '/inspection/list', label: 'nav.inspecciones', icon: 'pi pi-clipboard' },
    { to: '/inspection/new', label: 'inspeccion.newTitle', icon: 'pi pi-plus-circle' },
    { to: '/identity-access/panel', label: 'nav.identityPanel', icon: 'pi pi-user' }
  ],
  supervisor: [
    { to: '/monitoring/dashboard', label: 'nav.dashboard', icon: 'pi pi-th-large' },
    { to: '/inspection/list', label: 'nav.receivedReports', icon: 'pi pi-inbox' },
    { to: '/inspection/new', label: 'inspeccion.new', icon: 'pi pi-plus-circle' },
    {
      label: 'nav.riskManagement',
      icon: 'pi pi-shield',
      children: [
        { to: '/risk-assessment/list', label: 'nav.evaluaciones', icon: 'pi pi-exclamation-triangle' },
        { to: '/risk-assessment/hazard/list', label: 'nav.peligros', icon: 'pi pi-ban' },
        { to: '/risk-assessment/patrones', label: 'nav.patrones', icon: 'pi pi-chart-bar' },
        { to: '/risk-assessment/alertas-patron', label: 'nav.alertasPatron', icon: 'pi pi-bell' },
        { to: '/risk-assessment/mapa-calor', label: 'nav.mapaCalor', icon: 'pi pi-fire' },
        { to: '/risk-assessment/resumen-diario', label: 'nav.resumenDiario', icon: 'pi pi-calendar' }
      ]
    },
    { to: '/mitigation/list', label: 'nav.mitigaciones', icon: 'pi pi-shield' },
    { to: '/mitigation/tickets', label: 'nav.correctiveTickets', icon: 'pi pi-ticket' },
    { to: '/mitigation/verificaciones', label: 'nav.verificaciones', icon: 'pi pi-check-circle' },
    { to: '/mitigation/historial', label: 'nav.historial', icon: 'pi pi-history' },
    { to: '/mitigation/alertas-sla', label: 'nav.alertasSLA', icon: 'pi pi-clock' },
    { to: '/mitigation/notificaciones-criticas', label: 'nav.notifCriticas', icon: 'pi pi-exclamation-circle' },
    {
      label: 'nav.operationalManagement',
      icon: 'pi pi-briefcase',
      children: [
        { to: '/organization-assets/site/list', label: 'nav.sedes', icon: 'pi pi-building' },
        { to: '/organization-assets/area/list', label: 'nav.areas', icon: 'pi pi-map-marker' },
        { to: '/organization-assets/asset/list', label: 'nav.activos', icon: 'pi pi-cog' },
        { to: '/mitigation/technicians', label: 'nav.tecnicos', icon: 'pi pi-users' }
      ]
    },
    {
      label: 'nav.monitoring',
      icon: 'pi pi-desktop',
      children: [
        { to: '/monitoring/maintenance', label: 'nav.maintenance', icon: 'pi pi-wrench' },
        { to: '/monitoring/sectors', label: 'nav.sectors', icon: 'pi pi-map' },
        { to: '/monitoring/technicians', label: 'nav.technicianDirectory', icon: 'pi pi-users' },
        { to: '/monitoring/reports', label: 'nav.archivedReports', icon: 'pi pi-file' }
      ]
    },
    { to: '/identity-access/panel', label: 'nav.identityPanel', icon: 'pi pi-user' }
  ],
  administrator: [
    { to: '/reportes/dashboard', label: 'sidebar.inicio', icon: 'pi pi-home' },
    { to: '/reportes/new', label: 'sidebar.nuevo_reporte', icon: 'pi pi-plus' },
    { to: '/reportes/list', label: 'sidebar.mis_reportes', icon: 'pi pi-list' },
    { to: '/reportes/history', label: 'sidebar.historial', icon: 'pi pi-history' },
    { to: '/reportes/alerts', label: 'sidebar.notificaciones', icon: 'pi pi-bell' },
    { to: '/reportes/predictive-indicators', label: 'sidebar.indicadores', icon: 'pi pi-chart-line' },
    { to: '/reportes/sst-plan', label: 'sidebar.plan_sst', icon: 'pi pi-shield' },
    { to: '/identity-access/panel', label: 'nav.identityPanel', icon: 'pi pi-user' }
  ]
}

const roleCode = computed(() => store.currentRole?.code || '')
const navItems = computed(() => navigation[roleCode.value] || [])
const flatNavItems = computed(() => navItems.value.flatMap(item => item.children ? item.children : [item]))
const currentTitle = computed(() => route.meta.title || flatNavItems.value.find(item => route.path.startsWith(item.to.replace(/\/(list|new|dashboard)$/, '')))?.label || 'RiskGuard')
const initials = computed(() => (store.currentUser?.name || 'RG').split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase())
const roleName = computed(() => {
  if (roleCode.value === 'administrator') return t('roles.administrator')
  if (roleCode.value === 'supervisor') return t('roles.supervisor')
  if (roleCode.value === 'plant-operator') return t('roles.operator')
  return store.currentRole?.name || ''
})

function setLocale(language) {
  if (locale.value === language) return
  locale.value = language
  try { localStorage.setItem('riskguard-locale', language) } catch {}
}

function closeSidebar() {
  sidebarOpen.value = false
}

function logout() {
  store.logout().then(() => router.push('/login'))
}
</script>

<template>
  <div class="rg-dark">
    <pv-toast />
    <pv-confirm-dialog />
    <div v-if="sidebarOpen" class="rg-overlay" @click="closeSidebar" />
    <div class="rg-layout">
      <aside class="rg-sidebar" :class="{ open: sidebarOpen }">
        <router-link :to="navItems[0]?.to || '/'" class="rg-sidebar-logo" @click="closeSidebar">
          <img class="rg-sidebar-brand" :src="riskguardLogo" alt="RiskGuard Solutions" />
        </router-link>

        <nav class="rg-nav">
          <template v-for="item in navItems" :key="item.to || item.label">
            <div v-if="item.children" class="rg-nav-group">
              <div class="rg-nav-group-title">
                <i :class="item.icon" />
                {{ t(item.label) }}
              </div>
              <router-link
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="rg-nav-item rg-nav-child"
                @click="closeSidebar"
              >
                <i :class="child.icon" />
                {{ t(child.label) }}
              </router-link>
            </div>
            <router-link
              v-else
              :to="item.to"
              class="rg-nav-item"
              @click="closeSidebar"
            >
              <i :class="item.icon" />
              {{ t(item.label) }}
            </router-link>
          </template>
        </nav>

        <div class="rg-sidebar-bottom">
          <div class="rg-lang-toggle">
            <button class="rg-lang-btn" :class="{ active: locale === 'es' }" @click="setLocale('es')">ES</button>
            <button class="rg-lang-btn" :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
          </div>
          <div class="rg-user-info">
            <div class="rg-avatar">{{ initials }}</div>
            <div class="rg-user-copy">
              <div class="rg-user-name">{{ store.currentUser?.name || store.currentUser?.username }}</div>
              <div class="rg-user-role">{{ roleName }}</div>
            </div>
            <button class="rg-logout" title="Cerrar sesion" @click="logout"><i class="pi pi-sign-out" /></button>
          </div>
        </div>
      </aside>

      <div class="rg-main">
        <header class="rg-topbar">
          <div class="rg-topbar-left">
            <button class="rg-menu-btn" @click="sidebarOpen = true"><i class="pi pi-bars" /></button>
            <span class="rg-topbar-title">{{ currentTitle.includes('.') ? t(currentTitle) : currentTitle }}</span>
          </div>
          <div class="rg-topbar-right">
            <span class="rg-role-pill">{{ roleName }}</span>
            <i class="pi pi-bell" />
          </div>
        </header>
        <main class="rg-content">
          <router-view />
        </main>
        <footer-content />
      </div>
    </div>
  </div>
</template>
