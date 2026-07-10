import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class TicketAccionCorrectivaApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/corrective-action-tickets') }
    getTickets()                { return this.#ep.getAll() }
    getTicketById(id)           { return this.#ep.getById(id) }
    getBySectorId(sId)          { return this.#ep.getByParam('sectorId', sId) }
    getByEstado(est)            { return this.#ep.getByParam('status', est) }
    getByTecnicoId(tId)         { return this.#ep.getByParam('assignedTechnicianId', tId) }
    createTicket(t)             { return this.#ep.create(t) }
    updateTicket(t)             { return this.#ep.update(t.id, t) }
    deleteTicket(id)            { return this.#ep.delete(id) }
}
