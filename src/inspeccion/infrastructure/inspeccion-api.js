import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class InspeccionApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/inspecciones') }
    getInspecciones()       { return this.#ep.getAll() }
    getById(id)             { return this.#ep.getById(id) }
    create(r)               { return this.#ep.create(r) }
    update(r)               { return this.#ep.update(r.id, r) }
    delete(id)              { return this.#ep.delete(id) }
}
