<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { useReportsStore } from '@/reports/application/reportes.store.js';

const { t, locale } = useI18n();
const route = useRoute();
const store = useReportsStore();

const sidebarOpen = ref(false);

const navItems = [
  { to: '/',                               label: 'sidebar.inicio',         icon: 'pi pi-home' },
  { to: '/reportes/new',                   label: 'sidebar.nuevo_reporte',  icon: 'pi pi-plus' },
  { to: '/reportes/list',                  label: 'sidebar.mis_reportes',   icon: 'pi pi-list' },
  { to: '/reportes/alerts',                label: 'sidebar.notificaciones', icon: 'pi pi-bell' },
  { to: '/reportes/predictive-indicators', label: 'sidebar.indicadores',    icon: 'pi pi-chart-line' },
  { to: '/reportes/sst-plan',              label: 'sidebar.plan_sst',       icon: 'pi pi-shield' }
];

const titleMap = {
  '/':                               'sidebar.inicio',
  '/reportes/new':                   'sidebar.nuevo_reporte',
  '/reportes/list':                  'sidebar.mis_reportes',
  '/reportes/alerts':                'sidebar.notificaciones',
  '/reportes/predictive-indicators': 'sidebar.indicadores',
  '/reportes/sst-plan':              'sidebar.plan_sst'
};

const currentTitle = computed(() => t(titleMap[route.path] ?? 'sidebar.inicio'));

const isActive = (to) => to === '/'
    ? route.path === '/'
    : route.path.startsWith(to);

const setLocale = (lang) => {
  locale.value = lang;
};

const unresolvedCount = computed(() =>
    store.unresolvedCriticalAlerts?.length ?? 0
);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />

  <div class="rg-layout">

    <!-- MOBILE OVERLAY -->
    <div
        v-if="sidebarOpen"
        class="rg-overlay"
        @click="closeSidebar"
    />

    <!-- SIDEBAR -->
    <aside
        class="rg-sidebar"
        :class="{ open: sidebarOpen }"
    >

      <router-link
          to="/"
          class="rg-sidebar-logo"
          @click="closeSidebar"
      >
        <div class="rg-logo-box">
          <i class="pi pi-shield" />
        </div>

        RISK<span class="rg-logo-accent">GUARD</span>
      </router-link>

      <nav class="rg-nav">
        <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rg-nav-item"
            :class="{ active: isActive(item.to) }"
            @click="closeSidebar"
        >
          <i :class="item.icon" />
          {{ t(item.label) }}
        </router-link>
      </nav>

      <div class="rg-sidebar-bottom">

        <div class="rg-lang-toggle">
          <button
              class="rg-lang-btn"
              :class="{ active: locale === 'es' }"
              @click="setLocale('es')"
          >
            ES
          </button>

          <button
              class="rg-lang-btn"
              :class="{ active: locale === 'en' }"
              @click="setLocale('en')"
          >
            EN
          </button>
        </div>

        <div class="rg-user-info">
          <div class="rg-avatar">G</div>

          <div>
            <div class="rg-user-name">Gerente_01</div>
            <div class="rg-user-role">u202400001</div>
          </div>
        </div>

      </div>

    </aside>

    <!-- MAIN -->
    <div class="rg-main">

      <!-- TOPBAR -->
      <header class="rg-topbar">

        <div class="rg-topbar-left">

          <!-- MOBILE MENU -->
          <button
              class="rg-menu-btn"
              @click="toggleSidebar"
          >
            <i class="pi pi-bars" />
          </button>

          <span class="rg-topbar-title">
            {{ currentTitle }}
          </span>

        </div>

        <div class="rg-topbar-right">

          <router-link
              to="/reportes/alerts"
              class="rg-bell"
          >
            <i class="pi pi-bell" />

            <span
                v-if="unresolvedCount > 0"
                class="rg-bell-badge"
            >
              {{ unresolvedCount }}
            </span>
          </router-link>

          <span class="rg-user-desktop">
            Gerente
          </span>

        </div>

      </header>

      <!-- CONTENT -->
      <main class="rg-content">
        <router-view />
      </main>

    </div>

  </div>
</template>

<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
}

.rg-layout {
  display: flex;
  min-height: 100vh;
  background: var(--dark-bg);
  color: var(--text-color);
  font-family: inherit;
  overflow-x: hidden;
}

/* OVERLAY */
.rg-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 90;
}

/* ───────────────── SIDEBAR ───────────────── */

.rg-sidebar {
  width: 230px;
  min-width: 230px;
  background: #0D1520;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.rg-sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  height: 60px;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--text-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);
  flex-shrink: 0;
}

.rg-logo-box {
  width: 34px;
  height: 34px;
  background: var(--primary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.rg-logo-accent {
  color: var(--primary-color);
}

.rg-nav {
  flex: 1;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
}

.rg-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.rg-nav-item:hover {
  color: var(--primary-color);
  background: rgba(239, 97, 15, 0.06);
}

.rg-nav-item.active {
  color: var(--primary-color);
  background: rgba(239, 97, 15, 0.12);
  border-left-color: var(--primary-color);
}

.rg-nav-item i {
  font-size: 15px;
  width: 18px;
  flex-shrink: 0;
}

/* BOTTOM */
.rg-sidebar-bottom {
  padding: 16px 18px;
  border-top: 1px solid rgba(71, 85, 105, 0.3);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rg-lang-toggle {
  display: flex;
  gap: 6px;
}

.rg-lang-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(71, 85, 105, 0.5);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.rg-lang-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.rg-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rg-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(239, 97, 15, 0.15);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rg-user-name {
  font-size: 12px;
  font-weight: 600;
}

.rg-user-role {
  font-size: 10px;
  color: var(--text-secondary);
}
.rg-main {
  flex: 1;
  margin-left: 230px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: calc(100% - 230px);
}

.rg-topbar {
  height: 60px;
  background: var(--card-bg);
  border-bottom: 1px solid rgba(71, 85, 105, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.rg-topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.rg-topbar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.rg-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  color: var(--text-color);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.rg-topbar-right {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 13px;
  color: var(--text-secondary);
}

.rg-bell {
  position: relative;
  color: var(--text-secondary);
  font-size: 17px;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.rg-bell-badge {
  position: absolute;
  top: -5px;
  right: -7px;
  background: #EF4444;
  color: white;
  font-size: 9px;
  font-weight: 700;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rg-content {
  flex: 1;
  background: var(--dark-bg);
  overflow-y: auto;
}

/* SCROLLBAR */
.rg-sidebar::-webkit-scrollbar {
  width: 4px;
}

.rg-sidebar::-webkit-scrollbar-thumb {
  background: rgba(71,85,105,0.5);
  border-radius: 2px;
}

/* ───────────────── TABLET ───────────────── */

@media (max-width: 1024px) {

  .rg-sidebar {
    transform: translateX(-100%);
  }

  .rg-sidebar.open {
    transform: translateX(0);
  }

  .rg-main {
    margin-left: 0;
    width: 100%;
  }

  .rg-menu-btn {
    display: flex;
  }
}

/* ───────────────── MOBILE ───────────────── */

@media (max-width: 768px) {

  .rg-topbar {
    padding: 0 16px;
    height: 56px;
  }

  .rg-topbar-title {
    font-size: 14px;
  }

  .rg-user-desktop {
    display: none;
  }

  .rg-content {
    width: 100%;
    overflow-x: hidden;
  }

  .rg-sidebar {
    width: 260px;
    min-width: 260px;
  }
}

@media (max-width: 480px) {

  .rg-topbar {
    padding: 0 12px;
  }

  .rg-topbar-title {
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rg-sidebar {
    width: 100%;
    min-width: 100%;
  }

  .rg-nav-item {
    font-size: 14px;
    padding: 15px 18px;
  }

  .rg-sidebar-logo {
    height: 64px;
  }
}
</style>