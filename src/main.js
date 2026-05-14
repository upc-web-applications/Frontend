import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Material from '@primeuix/themes/material';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';

import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Chart from 'primevue/chart';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import FloatLabel from 'primevue/floatlabel';
import Calendar from 'primevue/calendar';
import SelectButton from 'primevue/selectbutton';
import MultiSelect from 'primevue/multiselect';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';

import i18n from "/i18n.js";
import pinia from "/pinia.js";
import router from "/router.js";

const app = createApp(App);

app
    .use(i18n)
    .use(PrimeVue, { theme: { preset: Material }, ripple: true })
    .use(ConfirmationService)
    .use(ToastService)
    .use(router)
    .use(pinia)

    // Componentes
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-data-table', DataTable)
    .component('pv-column', Column)
    .component('pv-select', Select)
    .component('pv-input-text', InputText)
    .component('pv-toast', Toast)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-chart', Chart)
    .component('pv-tag', Tag)
    .component('pv-progress-bar', ProgressBar)
    .component('pv-spinner', ProgressSpinner)
    .component('pv-dialog', Dialog)
    .component('pv-float-label', FloatLabel)
    .component('pv-calendar', Calendar)
    .component('pv-select-button', SelectButton)
    .component('pv-multi-select', MultiSelect)
    .component('pv-paginator', Paginator)
    .directive('tooltip', Tooltip)
    .mount('#app');