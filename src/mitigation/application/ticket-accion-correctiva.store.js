import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TicketAccionCorrectivaApi } from '@/mitigation/infrastructure/ticket-accion-correctiva-api.js'
import { TicketAccionCorrectivaAssembler } from '@/mitigation/infrastructure/ticket-accion-correctiva.assembler.js'
import { needsSlaSync, withSlaEvaluation } from '@/mitigation/application/sla-policy.js'

const api = new TicketAccionCorrectivaApi()
export const useTicketAccionCorrectivaStore = defineStore('ticketAccionCorrectiva', () => {
    const tickets = ref([]); const errors = ref([]); const loaded = ref(false)
    function fetchAll() { return api.getTickets().then(r => { tickets.value = TicketAccionCorrectivaAssembler.toEntitiesFromResponse(r); loaded.value = true; return tickets.value }).catch(e => { errors.value.push(e); loaded.value = true; return [] }) }
    function getById(id) { return tickets.value.find(t => t.id === id) }
    function getBySectorId(sId) { return tickets.value.filter(t => t.sectorId === parseInt(sId)) }
    function getByEstado(est) { return tickets.value.filter(t => t.estado === est) }
    async function add(ticket) {
        const max = tickets.value.reduce((m, t) => Math.max(m, t.ticketNumber || 0), 0)
        const payload = { ...ticket, ticketNumber: max + 1 }
        return api.createTicket(payload).then(r => { const e = TicketAccionCorrectivaAssembler.toEntityFromResource(r.data); tickets.value.push(e); return e }).catch(e => { errors.value.push(e); return Promise.reject(e) })
    }
    function update(ticket) { return api.updateTicket(ticket).then(r => { const u = TicketAccionCorrectivaAssembler.toEntityFromResource(r.data); const i = tickets.value.findIndex(t => t.id === u.id); if (i !== -1) tickets.value[i] = u; return u }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    function remove(id) { return api.deleteTicket(id).then(() => { const i = tickets.value.findIndex(t => t.id === id); if (i !== -1) tickets.value.splice(i, 1) }).catch(e => { errors.value.push(e); return Promise.reject(e) }) }
    async function refreshSlaStatus() {
        const now = new Date()
        const updatedTickets = []
        for (const ticket of tickets.value) {
            const evaluatedTicket = withSlaEvaluation(ticket, now)
            if (needsSlaSync(ticket, evaluatedTicket)) {
                updatedTickets.push(await update(evaluatedTicket))
            }
        }
        return updatedTickets
    }
    return { tickets, errors, loaded, fetchAll, getById, getBySectorId, getByEstado, add, update, remove, refreshSlaStatus }
})
