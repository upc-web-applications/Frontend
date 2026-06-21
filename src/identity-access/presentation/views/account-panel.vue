<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'
import RolePanelCard from '@/identity-access/presentation/components/role-panel-card.vue'

const router = useRouter()
const { t } = useI18n()
const store = useIdentityAccessStore()
let inactivityTimer = null
const inactivityLimit = 30000

onMounted(() => {
  if (!store.rolesLoaded) store.fetchRoles()
  startInactivityControl()
})

function closeSession() {
  store.logout().then(() => router.push('/login'))
}

function expireSession() {
  store.logout('session-expired-by-inactivity').then(() => {
    router.push({ path: '/login', query: { reason: 'expired' } })
  })
}

function resetInactivityTimer() {
  store.touchSession()
  clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(expireSession, inactivityLimit)
}

function startInactivityControl() {
  resetInactivityTimer()
  window.addEventListener('click', resetInactivityTimer)
  window.addEventListener('keydown', resetInactivityTimer)
  window.addEventListener('mousemove', resetInactivityTimer)
  window.addEventListener('scroll', resetInactivityTimer)
}

onUnmounted(() => {
  clearTimeout(inactivityTimer)
  window.removeEventListener('click', resetInactivityTimer)
  window.removeEventListener('keydown', resetInactivityTimer)
  window.removeEventListener('mousemove', resetInactivityTimer)
  window.removeEventListener('scroll', resetInactivityTimer)
})
</script>

<template>
  <main class="content">
    <section class="panel role-panel p-4">
      <div class="panel-actions">
        <pv-button :label="t('account.logout')" icon="pi pi-sign-out" class="orange-button" @click="closeSession" />
      </div>

      <role-panel-card
        v-if="store.currentUser"
        :user="store.currentUser"
        :role="store.currentRole"
      />
    </section>
  </main>
</template>

<style scoped>
.role-panel {
  min-height: 360px;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
</style>
