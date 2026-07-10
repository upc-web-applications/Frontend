import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Paginator from 'primevue/paginator'
import Password from 'primevue/password'
import ProgressBar from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToggleSwitch from 'primevue/toggleswitch'
import Toolbar from 'primevue/toolbar'
import i18n from '@/i18n.js'
import pinia from '@/pinia.js'
import router from '@/router.js'

createApp(App)
  .use(i18n)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: { darkModeSelector: '.rg-dark', cssLayer: false }
    },
    ripple: true
  })
  .use(ToastService)
  .use(ConfirmationService)
  .directive('tooltip', Tooltip)
  .component('pv-button', Button)
  .component('pv-card', Card)
  .component('pv-chart', Chart)
  .component('pv-column', Column)
  .component('pv-confirm-dialog', ConfirmDialog)
  .component('pv-data-table', DataTable)
  .component('pv-calendar', DatePicker)
  .component('pv-dialog', Dialog)
  .component('pv-icon-field', IconField)
  .component('pv-input-icon', InputIcon)
  .component('pv-input-number', InputNumber)
  .component('pv-input-text', InputText)
  .component('pv-paginator', Paginator)
  .component('pv-password', Password)
  .component('pv-progress-bar', ProgressBar)
  .component('pv-spinner', ProgressSpinner)
  .component('pv-select', Select)
  .component('pv-tag', Tag)
  .component('pv-textarea', Textarea)
  .component('pv-toast', Toast)
  .component('pv-toggle-switch', ToggleSwitch)
  .component('pv-toolbar', Toolbar)
  .use(pinia)
  .use(router)
  .mount('#app')
