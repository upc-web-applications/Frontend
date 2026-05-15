import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import Material from '@primeuix/themes/material'
import PrimeVue from 'primevue/config'
import i18n from '@/i18n.js'
import pinia from '@/pinia.js'
import router from '@/router.js'
import {
  Button,
  IconField,
  InputIcon,
  InputText,
  Password,
  SelectButton,
  Toast,
  ToastService
} from 'primevue'

createApp(App)
  .use(i18n)
  .use(PrimeVue, { theme: { preset: Material }, ripple: true })
  .use(ToastService)
  .component('pv-button', Button)
  .component('pv-icon-field', IconField)
  .component('pv-input-icon', InputIcon)
  .component('pv-input-text', InputText)
  .component('pv-password', Password)
  .component('pv-select-button', SelectButton)
  .component('pv-toast', Toast)
  .use(pinia)
  .use(router)
  .mount('#app')
