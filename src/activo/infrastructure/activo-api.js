import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class ActivoApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/activos') }
    getActivos()            { return this.#ep.getAll() }
    getActivoById(id)       { return this.#ep.getById(id) }
    getByAreaId(aId)        { return this.#ep.getByParam('areaId', aId) }
    createActivo(r)         { return this.#ep.create(r) }
    updateActivo(r)         { return this.#ep.update(r.id, r) }
    deleteActivo(id)        { return this.#ep.delete(id) }
}
