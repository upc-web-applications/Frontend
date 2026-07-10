<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useIdentityAccessStore from '@/identity-access/application/identity-access.store.js'
import LanguageSwitcher from '@/shared/presentation/components/language-switcher.vue'
import riskguardLogo from '@/assets/riskguard-logo.png'

const homeByRole = {
  'plant-operator': '/inspection/list',
  supervisor: '/monitoring/dashboard',
  administrator: '/reportes/dashboard'
}

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const store = useIdentityAccessStore()
const email = ref('supervisor@riskguard.tech')
const password = ref('Risk123')
const remember = ref(false)
const errorMessage = ref('')
const loading = ref(false)

if (route.query.reason === 'expired') errorMessage.value = t('login.expired')

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
      router.push(route.query.redirect || homeByRole[store.currentRole?.code] || '/')
      return
    }
    errorMessage.value = result.reason === 'invalid' ? t('login.invalidCredentials') : t('login.error')
    password.value = ''
  })
}
</script>

<template>
  <div class="login-grid">
    <section class="brand-side">
      <img class="login-logo-img" :src="riskguardLogo" alt="RiskGuard Solutions" />
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
  background: var(--rg-bg);
}

.brand-side {
  background: var(--rg-bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  border-right: 1px solid var(--rg-border);
}

.form-side {
  background: var(--rg-bg-2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-logo-img {
  width: min(340px, 74%);
  max-height: 260px;
  object-fit: contain;
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
  background: var(--rg-border);
  margin: 2rem 0 1.2rem;
}

@media (max-width: 860px) {
  .login-grid {
    grid-template-columns: 1fr;
  }

  .brand-side {
    min-height: 220px;
  }

  .brand-side {
    border-right: 0;
    border-bottom: 1px solid var(--rg-border);
  }

  .login-logo-img {
    width: min(260px, 78%);
  }
}
</style>
