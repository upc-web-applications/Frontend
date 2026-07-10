import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AlertaSLAApi } from '@/mitigation/infrastructure/alerta-sla-api.js'
import { AlertaSLAAssembler } from '@/mitigation/infrastructure/alerta-sla.assembler.js'

const api = new AlertaSLAApi()
export const useAlertaSLAStore = defineStore('alertaSLA', () => {
    const alertas = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { errors.value = []; return api.getAlertas().then(r => { alertas.value = AlertaSLAAssembler.toEntitiesFromResponse(r); loaded.value = true; return alertas.value }).catch(e => { errors.value.push(e); loaded.value = true; return [] }) }
    function getById(id) { return alertas.value.find(a => a.id === id) }
    function getByTicketId(tId) { return alertas.value.filter(a => a.ticketId === tId) }
    function add(alerta) { return api.createAlerta(alerta).then(r => alertas.value.push(AlertaSLAAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function update(alerta) { return api.updateAlerta(alerta).then(r => { const u = AlertaSLAAssembler.toEntityFromResource(r.data); const i = alertas.value.findIndex(a => a.id === u.id); if (i !== -1) alertas.value[i] = u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteAlerta(id).then(() => { const i = alertas.value.findIndex(a => a.id === id); if (i !== -1) alertas.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { alertas, errors, loaded, fetchAll, getById, getByTicketId, add, update, remove }
})
