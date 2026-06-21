import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class TecnicoApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/tecnicos') }
    getTecnicos()               { return this.#ep.getAll() }
    getTecnicoById(id)          { return this.#ep.getById(id) }
    createTecnico(t)            { return this.#ep.create(t) }
    updateTecnico(t)            { return this.#ep.update(t.id, t) }
    deleteTecnico(id)           { return this.#ep.delete(id) }
}
