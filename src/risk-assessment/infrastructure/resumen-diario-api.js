import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
export class ResumenDiarioApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/resumenes-diarios') }
    getAll()            { return this.#ep.getAll() }
    getById(id)         { return this.#ep.getById(id) }
    getBySectorId(sId)  { return this.#ep.getByParam('sectorId', sId) }
    getByFecha(f)       { return this.#ep.getByParam('fecha', f) }
    create(r)           { return this.#ep.create(r) }
    update(r)           { return this.#ep.update(r.id, r) }
    delete(id)          { return this.#ep.delete(id) }
}
