import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AlertaPatronApi } from '@/risk-assessment/infrastructure/alerta-patron-api.js'
import { AlertaPatronAssembler } from '@/risk-assessment/infrastructure/alerta-patron.assembler.js'

const api = new AlertaPatronApi()
export const useAlertaPatronStore = defineStore('alertaPatron', () => {
    const alertas = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getAlertas().then(r => { alertas.value = AlertaPatronAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return alertas.value.find(a => a.id === parseInt(id)) }
    function getBySectorId(sId) { return alertas.value.filter(a => a.sectorId === parseInt(sId)) }
    function add(alerta) { return api.createAlerta(alerta).then(r => alertas.value.push(AlertaPatronAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(alerta) { return api.updateAlerta(alerta).then(r => { const u = AlertaPatronAssembler.toEntityFromResource(r.data); const i = alertas.value.findIndex(a => a.id === u.id); if (i !== -1) alertas.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteAlerta(id).then(() => { const i = alertas.value.findIndex(a => a.id === id); if (i !== -1) alertas.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { alertas, errors, loaded, fetchAll, getById, getBySectorId, add, update, remove }
})
