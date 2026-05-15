<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const store = useIdentityAccessStore()
const email = ref('supervisor@riskguard.tech')
const password = ref('Risk123')
const remember = ref(false)
const errorMessage = ref('')
const attempts = ref(0)
const loading = ref(false)

onMounted(() => {
  if (!store.usersLoaded) store.fetchUsers()
  if (!store.rolesLoaded) store.fetchRoles()
  const savedEmail = localStorage.getItem('riskguard-email')
  if (savedEmail) email.value = savedEmail
  if (route.query.reason === 'expired') errorMessage.value = t('login.expired')
})

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function login() {
  errorMessage.value = ''
  if (!isValidEmail(email.value)) {
    errorMessage.value = t('login.invalidEmail')
    return
  }
  loading.value = true
  store.authenticate(email.value, password.value).then(result => {
    loading.value = false
    if (result.success) {
      if (remember.value) localStorage.setItem('riskguard-email', email.value)
      else localStorage.removeItem('riskguard-email')
      router.push('/identity-access/panel')
      return
    }
    attempts.value = result.attempts || attempts.value
    errorMessage.value = result.reason === 'blocked' ? t('login.blocked') : t('login.invalidCredentials')
    password.value = ''
  })
}
</script>

<template>
  <div class="login-grid">
    <section class="brand-side">
      <div class="shield"></div>
      <div class="risk-logo login-logo">Risk<span>Guard</span></div>
    </section>
    <section class="form-side">
      <div class="login-card">
        <div class="flex justify-content-end mb-4">
          <language-switcher />
        </div>
        <h1>{{ t('login.title') }}</h1>
        <p class="risk-muted">{{ t('login.subtitle') }}</p>
        <form class="mt-5" @submit.prevent="login">
          <div class="field mb-3">
            <label for="email">{{ t('login.email') }}</label>
            <pv-icon-field>
              <pv-input-icon class="pi pi-envelope" />
              <pv-input-text id="email" v-model="email" class="auth-input" autocomplete="username" />
            </pv-icon-field>
          </div>
          <div class="field mb-3">
            <div class="flex justify-content-between">
              <label for="password">{{ t('login.password') }}</label>
              <a class="forgot-link" href="#">{{ t('login.forgot') }}</a>
            </div>
            <pv-password id="password" v-model="password" class="auth-input" :feedback="false" toggle-mask autocomplete="current-password" />
          </div>
          <div class="flex align-items-center justify-content-between mb-3">
            <label class="risk-muted text-sm">
              <input v-model="remember" type="checkbox" />
              {{ t('login.remember') }}
            </label>
            <span v-if="attempts > 0" class="risk-muted text-sm">{{ t('login.attempts', { count: attempts }) }}</span>
          </div>
          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
          <pv-button :label="t('login.submit')" icon="pi pi-sign-in" icon-pos="right" class="risk-button w-full mt-3" type="submit" :loading="loading" />
        </form>
        <div class="separator"></div>
        <p class="risk-muted text-center text-sm">{{ t('login.help') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login-grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  min-height: 100vh;
  background: #07101c;
}

.brand-side {
  background: #050b14;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.form-side {
  background: #101b2b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.shield {
  width: 64px;
  height: 72px;
  background: #ff5b00;
  clip-path: polygon(50% 0, 88% 14%, 88% 48%, 50% 100%, 12% 48%, 12% 14%);
  margin-bottom: 1rem;
}

.login-logo {
  font-size: clamp(3rem, 5.4vw, 5.2rem);
  text-transform: uppercase;
  color: #f6f8fb;
}

.login-card {
  width: min(390px, 100%);
}

.login-card h1 {
  font-size: 1.65rem;
  margin-bottom: 0.5rem;
}

.forgot-link {
  color: #ff9b6a;
  font-size: 0.75rem;
}

.separator {
  height: 1px;
  background: #243044;
  margin: 2rem 0 1.2rem;
}

@media (max-width: 860px) {
  .login-grid {
    grid-template-columns: 1fr;
  }

  .brand-side {
    min-height: 220px;
  }

  .login-logo {
    font-size: 2.6rem;
  }
}
</style>
