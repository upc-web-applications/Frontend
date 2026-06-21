<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'
import FooterContent from '@/shared/presentation/components/footer-content.vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useIdentityAccessStore()
const sidebarOpen = ref(false)

const navigation = {
  'plant-operator': [
    { to: '/inspection/new', label: 'inspeccion.newTitle', icon: 'pi pi-plus-circle' },
    { to: '/inspection/list', label: 'nav.inspecciones', icon: 'pi pi-clipboard' }
  ],
  supervisor: [
    { to: '/monitoring/dashboard', label: 'option.dashboard', icon: 'pi pi-th-large' },
    { to: '/inspection/list', label: 'nav.inspecciones', icon: 'pi pi-clipboard' },
    { to: '/risk-assessment/list', label: 'nav.evaluaciones', icon: 'pi pi-chart-bar' },
    { to: '/risk-assessment/mapa-calor', label: 'nav.mapaCalor', icon: 'pi pi-map' },
    { to: '/mitigation/list', label: 'nav.mitigaciones', icon: 'pi pi-shield' },
    { to: '/mitigation/tickets', label: 'nav.tickets', icon: 'pi pi-ticket' },
    { to: '/mitigation/alertas-sla', label: 'nav.alertasSLA', icon: 'pi pi-clock' },
    { to: '/site/list', label: 'nav.sedes', icon: 'pi pi-building' },
    { to: '/area/list', label: 'nav.areas', icon: 'pi pi-map-marker' },
    { to: '/asset/list', label: 'nav.activos', icon: 'pi pi-cog' },
    { to: '/technician', label: 'nav.tecnicos', icon: 'pi pi-users' }
  ],
  administrator: [
    { to: '/reportes/dashboard', label: 'sidebar.inicio', icon: 'pi pi-home' },
    { to: '/reportes/new', label: 'sidebar.nuevo_reporte', icon: 'pi pi-plus' },
    { to: '/reportes/list', label: 'sidebar.mis_reportes', icon: 'pi pi-list' },
    { to: '/reportes/history', label: 'sidebar.historial', icon: 'pi pi-history' },
    { to: '/reportes/alerts', label: 'sidebar.notificaciones', icon: 'pi pi-bell' },
    { to: '/reportes/predictive-indicators', label: 'sidebar.indicadores', icon: 'pi pi-chart-line' },
    { to: '/reportes/sst-plan', label: 'sidebar.plan_sst', icon: 'pi pi-shield' }
  ]
}

const roleCode = computed(() => store.currentRole?.code || '')
const navItems = computed(() => navigation[roleCode.value] || [])
const currentTitle = computed(() => route.meta.title || navItems.value.find(item => route.path.startsWith(item.to.replace(/\/(list|new|dashboard)$/, '')))?.label || 'RiskGuard')
const initials = computed(() => (store.currentUser?.fullName || 'RG').split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase())

function setLocale(language) {
  locale.value = language
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
          <div class="rg-logo-box"><i class="pi pi-shield" /></div>
          RISK<span class="rg-logo-accent">GUARD</span>
        </router-link>

        <nav class="rg-nav">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rg-nav-item"
            @click="closeSidebar"
          >
            <i :class="item.icon" />
            {{ t(item.label) }}
          </router-link>
        </nav>

        <div class="rg-sidebar-bottom">
          <div class="rg-lang-toggle">
            <button class="rg-lang-btn" :class="{ active: locale === 'es' }" @click="setLocale('es')">ES</button>
            <button class="rg-lang-btn" :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
          </div>
          <div class="rg-user-info">
            <div class="rg-avatar">{{ initials }}</div>
            <div class="rg-user-copy">
              <div class="rg-user-name">{{ store.currentUser?.fullName }}</div>
              <div class="rg-user-role">{{ store.currentRole?.name }}</div>
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
            <span class="rg-role-pill">{{ store.currentRole?.name }}</span>
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
