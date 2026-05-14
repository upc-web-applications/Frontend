import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TicketAccionCorrectivaApi } from '@/mitigation/infrastructure/ticket-accion-correctiva-api.js'
import { TicketAccionCorrectivaAssembler } from '@/mitigation/infrastructure/ticket-accion-correctiva.assembler.js'

const api = new TicketAccionCorrectivaApi()
export const useTicketAccionCorrectivaStore = defineStore('ticketAccionCorrectiva', () => {
    const tickets = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { api.getTickets().then(r => { tickets.value = TicketAccionCorrectivaAssembler.toEntitiesFromResponse(r); loaded.value = true }).catch(e => errors.value.push(e)) }
    function getById(id) { return tickets.value.find(t => t.id === parseInt(id)) }
    function getBySectorId(sId) { return tickets.value.filter(t => t.sectorId === parseInt(sId)) }
    function getByEstado(est) { return tickets.value.filter(t => t.estado === est) }
    function add(ticket) { return api.createTicket(ticket).then(r => { const e = TicketAccionCorrectivaAssembler.toEntityFromResource(r.data); tickets.value.push(e); return e }).catch(e => errors.value.push(e)) }
    function update(ticket) { return api.updateTicket(ticket).then(r => { const u = TicketAccionCorrectivaAssembler.toEntityFromResource(r.data); const i = tickets.value.findIndex(t => t.id === u.id); if (i !== -1) tickets.value[i] = u; return u }).catch(e => errors.value.push(e)) }
    function remove(id) { return api.deleteTicket(id).then(() => { const i = tickets.value.findIndex(t => t.id === id); if (i !== -1) tickets.value.splice(i, 1) }).catch(e => errors.value.push(e)) }
    return { tickets, errors, loaded, fetchAll, getById, getBySectorId, getByEstado, add, update, remove }
})
