import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createApp }  from 'vue'
import App            from './App.vue'
import PrimeVue       from 'primevue/config'
import RiskGuardTheme from '@/assets/theme.js'
import i18n           from '@/i18n.js'
import pinia          from '@/pinia.js'
import router         from '@/router.js'
import {
    Button, Column, ConfirmationService, ConfirmDialog,
    DataTable, Dialog, Select, SelectButton,
    Tag, Toast, ToastService, Tooltip
} from 'primevue'
import Chart           from 'primevue/chart'
import ProgressSpinner from 'primevue/progressspinner'
import DatePicker      from 'primevue/datepicker'
import Paginator       from 'primevue/paginator'

createApp(App)
    .use(i18n)
    .use(PrimeVue, { theme: { preset: RiskGuardTheme, options: { darkModeSelector: '.app-dark, :root' } }, ripple: true })
    .use(ConfirmationService)
    .use(ToastService)
    .use(router)
    .use(pinia)
    .directive('tooltip', Tooltip)
    .component('pv-button',         Button)
    .component('pv-column',         Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-data-table',     DataTable)
    .component('pv-dialog',         Dialog)
    .component('pv-select',         Select)
    .component('pv-select-button',  SelectButton)
    .component('pv-tag',            Tag)
    .component('pv-toast',          Toast)
    .component('pv-chart',          Chart)
    .component('pv-spinner',        ProgressSpinner)
    .component('pv-calendar',       DatePicker)
    .component('pv-paginator',      Paginator)
    .mount('#app')
