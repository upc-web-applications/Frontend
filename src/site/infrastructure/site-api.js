import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { SiteAssembler } from '@/site/infrastructure/site.assembler.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class SiteApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/headquarters') }
    getSites()           { return this.#ep.getAll() }
    getSiteById(id)      { return this.#ep.getById(id) }
    createSite(r)        { return this.#ep.create(SiteAssembler.toResourceFromEntity(r)) }
    updateSite(r)        { return this.#ep.update(r.id, SiteAssembler.toResourceFromEntity(r)) }
    deleteSite(id)       { return this.#ep.delete(id) }
}
