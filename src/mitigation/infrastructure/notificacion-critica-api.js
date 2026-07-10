import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class NotificacionCriticaApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/critical-notifications') }
    getNotificaciones()             { return this.#ep.getAll() }
    getNotificacionById(id)         { return this.#ep.getById(id) }
    getByTicketId(tId)              { return this.#ep.getByParam('ticketId', tId) }
    createNotificacion(n)           { return this.#ep.create(n) }
    updateNotificacion(n)           { return this.#ep.update(n.id, n) }
    deleteNotificacion(id)          { return this.#ep.delete(id) }
}
