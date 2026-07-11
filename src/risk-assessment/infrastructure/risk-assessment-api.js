import { BaseApi } from '@/shared/infrastructure/base-api.js'
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js'
import { RiskAssessmentAssembler } from '@/risk-assessment/infrastructure/risk-assessment.assembler.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class RiskAssessmentApi extends BaseApi {
    #ep
    constructor() { super(); this.#ep = new BaseEndpoint(this, '/risk-assessments') }
    getRiskAssessments()             { return this.#ep.getAll() }
    getRiskAssessmentById(id)        { return this.#ep.getById(id) }
    getByAreaId(aId)                 { return this.#ep.getByParam('sector', aId) }
    createRiskAssessment(r)          { return this.#ep.create(RiskAssessmentAssembler.toResourceFromEntity(r)) }
    updateRiskAssessment(r)          { return this.#ep.update(r.id, RiskAssessmentAssembler.toResourceFromEntity(r)) }
    deleteRiskAssessment(id)         { return this.#ep.delete(id) }
}
