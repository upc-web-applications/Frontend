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
  Card,
  Column,
  DataTable,
  InputText,
  Select,
  SelectButton,
  Tag,
  Textarea,
  Toast,
  ToastService,
  ToggleSwitch,
  Toolbar
} from 'primevue'

createApp(App)
  .use(i18n)
  .use(PrimeVue, { theme: { preset: Material }, ripple: true })
  .use(ToastService)
  .component('pv-button', Button)
  .component('pv-card', Card)
  .component('pv-column', Column)
  .component('pv-data-table', DataTable)
  .component('pv-input-text', InputText)
  .component('pv-select', Select)
  .component('pv-select-button', SelectButton)
  .component('pv-tag', Tag)
  .component('pv-textarea', Textarea)
  .component('pv-toast', Toast)
  .component('pv-toggle-switch', ToggleSwitch)
  .component('pv-toolbar', Toolbar)
  .use(router)
  .use(pinia)
  .mount('#app')
