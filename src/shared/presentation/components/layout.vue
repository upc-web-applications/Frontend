<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'
import FooterContent from '@/shared/presentation/components/footer-content.vue'

const { t } = useI18n()
const route = useRoute()

const items = [
  { label: 'option.dashboard', icon: 'pi pi-th-large', path: '/monitoring/dashboard' },
  { label: 'option.tickets', icon: 'pi pi-clipboard', path: '/monitoring/tickets' },
  { label: 'option.assetManagement', icon: 'pi pi-building', path: '/monitoring/maintenance' },
  { label: 'option.sectorMap', icon: 'pi pi-map', path: '/monitoring/sectors' },
  { label: 'option.technicalDirectory', icon: 'pi pi-users', path: '/monitoring/technicians' },
  { label: 'option.reports', icon: 'pi pi-chart-bar', path: '/monitoring/reports' }
]

const currentTitle = computed(() => {
  const item = items.find(option => route.path.startsWith(option.path))
  return item ? t(item.label) : t('option.dashboard')
})
</script>

<template>
  <pv-toast />
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">Risk<span>Guard</span></div>
      <div class="sidebar-subtitle">Plant Ops v1.0</div>
      <nav>
        <template v-for="item in items" :key="item.label">
          <router-link v-if="!item.disabled" class="side-link" :to="item.path">
            <i :class="item.icon"></i>
            <span>{{ t(item.label) }}</span>
          </router-link>
          <span v-else class="side-link disabled-link">
            <i :class="item.icon"></i>
            <span>{{ t(item.label) }}</span>
          </span>
        </template>
      </nav>
    </aside>
    <main class="main-area">
      <header class="topbar">
        <strong>{{ currentTitle }}</strong>
        <div class="flex align-items-center gap-3">
          <i class="pi pi-bell muted"></i>
          <i class="pi pi-question-circle muted"></i>
          <language-switcher />
        </div>
      </header>
      <router-view />
    </main>
  </div>
  <footer-content />
</template>
