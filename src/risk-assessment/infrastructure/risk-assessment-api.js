import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class RiskAssessmentApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/evaluaciones-riesgo') }
    getRiskAssessments()             { return this.#ep.getAll() }
    getRiskAssessmentById(id)        { return this.#ep.getById(id) }
    getByAreaId(aId)                 { return this.#ep.getByParam('areaId', aId) }
    createRiskAssessment(r)          { return this.#ep.create(r) }
    updateRiskAssessment(r)          { return this.#ep.update(r.id, r) }
    deleteRiskAssessment(id)         { return this.#ep.delete(id) }
}
