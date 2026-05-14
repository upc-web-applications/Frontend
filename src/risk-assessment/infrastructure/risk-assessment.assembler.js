import { RiskAssessment } from '@/risk-assessment/domain/model/risk-assessment.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class RiskAssessmentAssembler {
    static toEntityFromResource(r) { return new RiskAssessment({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['evaluaciones']
        return data.map(r => this.toEntityFromResource(r))
    }
}
