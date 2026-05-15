<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'
import FooterContent from '@/shared/presentation/components/footer-content.vue'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'

const route = useRoute()
const { t } = useI18n()
const store = useIdentityAccessStore()
const showNavigation = computed(() => route.name !== 'login')
const currentTitle = computed(() => t('option.panel'))
</script>

<template>
  <pv-toast />
  <div v-if="showNavigation" class="app-shell">
    <aside class="sidebar">
      <router-link to="/identity-access/panel" class="brand">Risk<span>Guard</span></router-link>
      <div class="sidebar-subtitle">Identity Access</div>
      <nav>
        <router-link class="side-link" to="/identity-access/panel">
          <i class="pi pi-shield"></i>
          <span>{{ t('option.panel') }}</span>
        </router-link>
      </nav>
    </aside>
    <main class="main-area">
      <header class="topbar">
        <strong>{{ currentTitle }}</strong>
        <div class="flex align-items-center gap-3">
          <span v-if="store.currentRole" class="role-pill">{{ store.currentRole.name }}</span>
          <language-switcher />
        </div>
      </header>
      <router-view />
    </main>
    <footer-content />
  </div>
  <div v-else class="risk-page">
    <router-view />
  </div>
</template>
