import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HistorialTicketApi } from '@/mitigation/infrastructure/historial-ticket-api.js'
import { HistorialTicketAssembler } from '@/mitigation/infrastructure/historial-ticket.assembler.js'

const api = new HistorialTicketApi()
export const useHistorialTicketStore = defineStore('historialTicket', () => {
    const historiales = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { errors.value = []; return api.getAll().then(r => { historiales.value = HistorialTicketAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function getById(id) { return historiales.value.find(h => h.id === id) }
    function getByTicketId(tId) { return historiales.value.filter(h => h.ticketId === tId) }
    function add(historial) { return api.create(historial).then(r => { const e = HistorialTicketAssembler.toEntityFromResource(r.data); historiales.value.push(e); return e }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function remove(id) { return api.delete(id).then(() => { const i = historiales.value.findIndex(h => h.id === id); if (i !== -1) historiales.value.splice(i, 1) }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    return { historiales, errors, loaded, fetchAll, getById, getByTicketId, add, remove }
})
