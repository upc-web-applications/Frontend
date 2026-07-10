import { RiskAssessment } from '@/risk-assessment/domain/model/risk-assessment.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class RiskAssessmentAssembler {
    static toEntityFromResource(r) {
        return new RiskAssessment({
            id: r.id,
            codigo: r.code,
            sector: r.sector,
            tipoPeligro: r.hazardType,
            descripcion: r.description,
            probabilidad: r.probability,
            severidad: r.severity,
            nivelRiesgo: r.riskLevel,
            medidasControl: r.controlMeasures,
            estado: r.status,
            fechaEvaluacion: r.evaluationDate,
            usuarioId: r.userId
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['evaluaciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
