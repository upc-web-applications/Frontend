/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Button from 'primevue/button'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
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
        }
    })
    .use(ToastService)
    .use(ConfirmationService)
    .component('pv-button',         Button)
    .component('pv-column',         Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-data-table',     DataTable)
    .component('pv-dialog',         Dialog)
    .component('pv-input-number',   InputNumber)
    .component('pv-input-text',     InputText)
    .component('pv-select',         Select)
    .component('pv-select-button',  SelectButton)
    .component('pv-tag',            Tag)
    .component('pv-textarea',       Textarea)
    .component('pv-toolbar',        Toolbar)
    .component('pv-toast',          Toast)
    .use(router)
    .use(pinia)
    .mount('#app')
