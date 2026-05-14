import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class HistorialTicketApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/historiales-ticket') }
    getAll()                { return this.#ep.getAll() }
    getById(id)             { return this.#ep.getById(id) }
    getByTicketId(tId)      { return this.#ep.getByParam('ticketId', tId) }
    create(r)               { return this.#ep.create(r) }
    delete(id)              { return this.#ep.delete(id) }
}
