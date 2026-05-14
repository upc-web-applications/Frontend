<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const navItems = [
  { to: '/risk-assessment/list',           label: 'nav.evaluaciones',    icon: 'pi pi-chart-bar' },
  { to: '/risk-assessment/mapa-calor',     label: 'nav.mapaCalor',       icon: 'pi pi-map' },
  { to: '/risk-assessment/patrones',       label: 'nav.patrones',        icon: 'pi pi-chart-line' },
  { to: '/risk-assessment/alertas-patron', label: 'nav.alertasPatron',   icon: 'pi pi-bell' },
  { to: '/risk-assessment/resumen-diario', label: 'nav.resumenDiario',   icon: 'pi pi-calendar' },
  { to: '/mitigation/list',               label: 'nav.mitigaciones',    icon: 'pi pi-shield' },
  { to: '/mitigation/tickets',             label: 'nav.tickets',         icon: 'pi pi-ticket' },
  { to: '/mitigation/verificaciones',      label: 'nav.verificaciones',  icon: 'pi pi-check-circle' },
  { to: '/mitigation/alertas-sla',         label: 'nav.alertasSLA',      icon: 'pi pi-clock' },
  { to: '/mitigation/notificaciones-criticas', label: 'nav.notifCriticas', icon: 'pi pi-exclamation-triangle' },
  { to: '/mitigation/historial',           label: 'nav.historial',       icon: 'pi pi-history' },
  { to: '/hazard/list',                   label: 'nav.peligros',        icon: 'pi pi-exclamation-triangle' },
  { to: '/technician',                    label: 'nav.tecnicos',        icon: 'pi pi-user' }
]

const titleMap = {
  '/risk-assessment':  'nav.evaluaciones',
  '/mitigation':       'nav.mitigaciones',
  '/hazard':           'nav.peligros',
  '/technician':       'nav.tecnicos'
}

const currentTitle = computed(() => {
  const base = '/' + route.path.split('/')[1]
  return t(titleMap[base] ?? 'nav.evaluaciones')
})

const getGroup = (path) => '/' + path.split('/').filter(Boolean).slice(0, 2).join('/')
const isParentItem = (to) => { const p = to.split('/').filter(Boolean); return p.length === 1 || (p.length === 2 && p[1] === 'list') }
const isActive = (to) => getGroup(route.path) === getGroup(to) && isParentItem(to)
const isActiveSub = (to) => getGroup(route.path) === getGroup(to) && !isParentItem(to) && route.path.startsWith(to.replace(/\/list$/, '').replace(/\/new$/, ''))
const setLocale = (lang) => { locale.value = lang }
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />
  <div class="rg-layout">
    <aside class="rg-sidebar">
      <router-link to="/risk-assessment/list" class="rg-sidebar-logo">
        <div class="rg-logo-box"><i class="pi pi-shield" /></div>
        RISK<span class="rg-logo-accent">GUARD</span>
      </router-link>

      <nav class="rg-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rg-nav-item"
          :class="{ active: isActive(item.to), 'active-sub': isActiveSub(item.to) }"
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
          <div class="rg-avatar">VL</div>
          <div>
            <div class="rg-user-name">Victor Jhosef Laura Acosta</div>
            <div class="rg-user-role">u202418655</div>
          </div>
        </div>
      </div>
    </aside>

    <div class="rg-main">
      <header class="rg-topbar">
        <span class="rg-topbar-title">{{ currentTitle }}</span>
        <div class="rg-topbar-right">
          <i class="pi pi-bell" style="font-size:16px;cursor:pointer" />
          <span>Victor L.</span>
        </div>
      </header>
      <main class="rg-content">
        <router-view />
      </main>
    </div>
  </div>
</template>
