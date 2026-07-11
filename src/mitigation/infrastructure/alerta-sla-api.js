import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { AlertaSLAAssembler } from '@/mitigation/infrastructure/alerta-sla.assembler.js'
export class AlertaSLAApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/sla-alerts') }
    getAlertas()            { return this.#ep.getAll() }
    getAlertaById(id)       { return this.#ep.getById(id) }
    getByTicketId(tId)      { return this.#ep.getByParam('ticketId', tId) }
    createAlerta(a)         { return this.#ep.create(AlertaSLAAssembler.toResourceFromEntity(a)) }
    updateAlerta(a)         { return this.#ep.update(a.id, AlertaSLAAssembler.toResourceFromEntity(a)) }
    deleteAlerta(id)        { return this.#ep.delete(id) }
}
