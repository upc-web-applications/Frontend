import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class HazardApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/peligros') }
    getHazards()              { return this.#ep.getAll() }
    getHazardById(id)         { return this.#ep.getById(id) }
    createHazard(r)           { return this.#ep.create(r) }
    updateHazard(r)           { return this.#ep.update(r.id, r) }
    deleteHazard(id)          { return this.#ep.delete(id) }
}
