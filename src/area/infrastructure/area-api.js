import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export class AreaApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/areas') }
    getAreas()              { return this.#ep.getAll() }
    getAreaById(id)         { return this.#ep.getById(id) }
    getAreasBySedeId(sId)   { return this.#ep.getByParam('sedeId', sId) }
    createArea(r)           { return this.#ep.create(r) }
    updateArea(r)           { return this.#ep.update(r.id, r) }
    deleteArea(id)          { return this.#ep.delete(id) }
}
