import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { AreaAssembler } from '@/organization-assets/area/infrastructure/area.assembler.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class AreaApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/areas') }
    getAreas()              { return this.#ep.getAll() }
    getAreaById(id)         { return this.#ep.getById(id) }
    getAreasBySedeId(sId)   { return this.#ep.getByParam('headquartersId', sId) }
    createArea(r)           { return this.#ep.create(AreaAssembler.toResourceFromEntity(r)) }
    updateArea(r)           { return this.#ep.update(r.id, AreaAssembler.toResourceFromEntity(r)) }
    deleteArea(id)          { return this.#ep.delete(id) }
}
