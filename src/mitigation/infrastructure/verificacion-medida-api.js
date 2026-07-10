import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class VerificacionMedidaApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/measure-verifications') }
    getVerificaciones()             { return this.#ep.getAll() }
    getVerificacionById(id)         { return this.#ep.getById(id) }
    getByTicketId(tId)              { return this.#ep.getByParam('ticketId', tId) }
    getPendientes()                 { return this.#ep.getByParam('verdict', '') }
    createVerificacion(v)           { return this.#ep.create(v) }
    updateVerificacion(v)           { return this.#ep.update(v.id, v) }
    deleteVerificacion(id)          { return this.#ep.delete(id) }
}
