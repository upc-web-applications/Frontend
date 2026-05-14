import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class SedeApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/sedes') }
    getSedes()           { return this.#ep.getAll() }
    getSedeById(id)      { return this.#ep.getById(id) }
    createSede(r)        { return this.#ep.create(r) }
    updateSede(r)        { return this.#ep.update(r.id, r) }
    deleteSede(id)       { return this.#ep.delete(id) }
}
