import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { NivelCriticidadAreaAssembler } from '@/risk-assessment/infrastructure/nivel-criticidad-area.assembler.js'
export class NivelCriticidadAreaApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/area-criticality-levels') }
    getAll()            { return this.#ep.getAll() }
    getById(id)         { return this.#ep.getById(id) }
    getBySectorId(sId)  { return this.#ep.getByParam('sector', sId) }
    create(r)           { return this.#ep.create(NivelCriticidadAreaAssembler.toResourceFromEntity(r)) }
    update(r)           { return this.#ep.update(r.id, NivelCriticidadAreaAssembler.toResourceFromEntity(r)) }
    delete(id)          { return this.#ep.delete(id) }
}
