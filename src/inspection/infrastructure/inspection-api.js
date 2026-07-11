import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { InspectionAssembler } from '@/inspection/infrastructure/inspection.assembler.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class InspectionApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/inspections') }
    getInspections(operatorId = null) {
        return operatorId
            ? this.http.get(`${this.#ep.endpointPath}/mine/${operatorId}`)
            : this.#ep.getAll()
    }
    getById(id)             { return this.#ep.getById(id) }
    create(r)               { return this.#ep.create(InspectionAssembler.toResourceFromEntity(r)) }
    update(r)               { return this.#ep.update(r.id, InspectionAssembler.toResourceFromEntity(r)) }
    delete(id)              { return this.#ep.delete(id) }
}
