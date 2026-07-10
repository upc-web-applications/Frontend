import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class MitigationApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/mitigations') }
    getMitigations()                 { return this.#ep.getAll() }
    getMitigationById(id)            { return this.#ep.getById(id) }
    getByAssessmentId(aId)           { return this.#ep.getByParam('riskAssessmentId', aId) }
    getByTicketId(tId)               { return this.#ep.getByParam('ticketId', tId) }
    createMitigation(r)              { return this.#ep.create(r) }
    updateMitigation(r)              { return this.#ep.update(r.id, r) }
    deleteMitigation(id)             { return this.#ep.delete(id) }
}
