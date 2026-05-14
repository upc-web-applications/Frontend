<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const navItems = [
  { to: '/sede/list',       label: 'nav.sedes',        icon: 'pi pi-building' },
  { to: '/area/list',       label: 'nav.areas',         icon: 'pi pi-map' },
  { to: '/activo/list',     label: 'nav.activos',       icon: 'pi pi-cog' },
  { to: '/inspeccion/list', label: 'nav.inspecciones',  icon: 'pi pi-clipboard' }
]

const titleMap = {
  '/sede':       'nav.sedes',
  '/area':       'nav.areas',
  '/activo':     'nav.activos',
  '/inspeccion': 'nav.inspecciones'
}

const currentTitle = computed(() => {
  const base = '/' + route.path.split('/')[1]
  return t(titleMap[base] ?? 'nav.sedes')
})

const isActive = (to) => route.path.startsWith(to.replace('/list', '').replace('/new', ''))
const setLocale = (lang) => { locale.value = lang }
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />
  <div class="rg-layout">
    <!-- SIDEBAR -->
    <aside class="rg-sidebar">
      <router-link to="/sede/list" class="rg-sidebar-logo">
        <div class="rg-logo-box"><i class="pi pi-shield" /></div>
        RISK<span class="rg-logo-accent">GUARD</span>
      </router-link>

      <nav class="rg-nav">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rg-nav-item"
          :class="{ active: isActive(item.to) }"
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
          <div class="rg-avatar">CF</div>
          <div>
            <div class="rg-user-name">Carlos Franco</div>
            <div class="rg-user-role">Administrador</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="rg-main">
      <header class="rg-topbar">
        <span class="rg-topbar-title">{{ currentTitle }}</span>
        <div class="rg-topbar-right">
          <i class="pi pi-bell" style="font-size:16px;cursor:pointer" />
          <span>Carlos Franco</span>
        </div>
      </header>
      <main class="rg-content">
        <router-view />
      </main>
    </div>
  </div>
</template>
