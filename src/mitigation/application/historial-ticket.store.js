import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HistorialTicketApi } from '@/mitigation/infrastructure/historial-ticket-api.js'
import { HistorialTicketAssembler } from '@/mitigation/infrastructure/historial-ticket.assembler.js'

const api = new HistorialTicketApi()
export const useHistorialTicketStore = defineStore('historialTicket', () => {
    const historiales = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getAll().then(r => { historiales.value = HistorialTicketAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return historiales.value.find(h => h.id === parseInt(id)) }
    function getByTicketId(tId) { return historiales.value.filter(h => h.ticketId === parseInt(tId)) }
    function add(historial) { return api.create(historial).then(r => historiales.value.push(HistorialTicketAssembler.toEntityFromResource(r.data))).catch(e => errors.value.push(e)) }
    function remove(id) { return api.delete(id).then(() => { const i = historiales.value.findIndex(h => h.id === id); if (i !== -1) historiales.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { historiales, errors, loaded, fetchAll, getById, getByTicketId, add, remove }
})
