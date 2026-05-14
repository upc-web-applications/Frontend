import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export class InspectionApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/inspecciones') }
    getInspections()       { return this.#ep.getAll() }
    getById(id)             { return this.#ep.getById(id) }
    create(r)               { return this.#ep.create(r) }
    update(r)               { return this.#ep.update(r.id, r) }
    delete(id)              { return this.#ep.delete(id) }
}
