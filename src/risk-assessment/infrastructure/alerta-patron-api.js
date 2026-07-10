import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class AlertaPatronApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/pattern-alerts') }
    getAlertas()                { return this.#ep.getAll() }
    getAlertaById(id)           { return this.#ep.getById(id) }
    getBySectorId(sId)          { return this.#ep.getByParam('sector', sId) }
    createAlerta(a)             { return this.#ep.create(a) }
    updateAlerta(a)             { return this.#ep.update(a.id, a) }
    deleteAlerta(id)            { return this.#ep.delete(id) }
}
