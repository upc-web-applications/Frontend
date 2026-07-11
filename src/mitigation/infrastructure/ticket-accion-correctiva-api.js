import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { TicketAccionCorrectivaAssembler } from '@/mitigation/infrastructure/ticket-accion-correctiva.assembler.js'
export class TicketAccionCorrectivaApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/corrective-action-tickets') }
    getTickets()                { return this.#ep.getAll() }
    getTicketById(id)           { return this.#ep.getById(id) }
    getBySectorId(sId)          { return this.#ep.getByParam('sectorId', sId) }
    getByEstado(est)            { return this.#ep.getByParam('status', est) }
    getByTecnicoId(tId)         { return this.#ep.getByParam('assignedTechnicianId', tId) }
    createTicket(t)             { return this.#ep.create(TicketAccionCorrectivaAssembler.toResourceFromEntity(t)) }
    updateTicket(t)             { return this.#ep.update(t.id, TicketAccionCorrectivaAssembler.toResourceFromEntity(t)) }
    deleteTicket(id)            { return this.#ep.delete(id) }
}
