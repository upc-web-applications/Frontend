<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'
import RolePanelCard from '@/identity-access/presentation/components/role-panel-card.vue'

const router = useRouter()
const { t } = useI18n()
const store = useIdentityAccessStore()

function closeSession() {
  store.logout().then(() => router.push('/login'))
}
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
