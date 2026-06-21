import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export class SiteApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/sedes') }
    getSites()           { return this.#ep.getAll() }
    getSiteById(id)      { return this.#ep.getById(id) }
    createSite(r)        { return this.#ep.create(r) }
    updateSite(r)        { return this.#ep.update(r.id, r) }
    deleteSite(id)       { return this.#ep.delete(id) }
}
