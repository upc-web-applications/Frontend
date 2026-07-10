import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class PatronRiesgoApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/risk-patterns') }
    getPatrones()               { return this.#ep.getAll() }
    getPatronById(id)           { return this.#ep.getById(id) }
    getBySectorId(sId)          { return this.#ep.getByParam('sectorId', sId) }
    createPatron(p)             { return this.#ep.create(p) }
    updatePatron(p)             { return this.#ep.update(p.id, p) }
    deletePatron(id)            { return this.#ep.delete(id) }
}
