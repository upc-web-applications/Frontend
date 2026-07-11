import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { HazardAssembler } from '@/risk-assessment/hazard/infrastructure/hazard.assembler.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class HazardApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/hazards') }
    getHazards()              { return this.#ep.getAll() }
    getHazardById(id)         { return this.#ep.getById(id) }
    createHazard(r)           { return this.#ep.create(HazardAssembler.toResourceFromEntity(r)) }
    updateHazard(r)           { return this.#ep.update(r.id, HazardAssembler.toResourceFromEntity(r)) }
    deleteHazard(id)          { return this.#ep.delete(id) }
}
