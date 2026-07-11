import { RiskAssessment } from '@/risk-assessment/domain/model/risk-assessment.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class RiskAssessmentAssembler {
    static #statusFromResource(status) { return { Pending: 'Pendiente', InProgress: 'En Evaluacion', Completed: 'Evaluado' }[status] ?? status }
    static #statusToResource(status) { return { Pendiente: 'Pending', 'En Evaluacion': 'InProgress', Evaluado: 'Completed', Cerrado: 'Completed' }[status] ?? status }
    static #riskFromResource(level) { return { Low: 'Bajo', Medium: 'Medio', High: 'Alto', Critical: 'Critico' }[level] ?? level }
    static #riskToResource(level) { return { Bajo: 'Low', Medio: 'Medium', Alto: 'High', Critico: 'Critical' }[level] ?? level }

    static toEntityFromResource(r) {
        return new RiskAssessment({
            id: r.id,
            codigo: r.code,
            sector: r.sector,
            tipoPeligro: r.hazardType,
            descripcion: r.description,
            probabilidad: r.probability,
            severidad: r.severity,
            nivelRiesgo: this.#riskFromResource(r.riskLevel),
            medidasControl: r.controlMeasures,
            estado: this.#statusFromResource(r.status),
            fechaEvaluacion: r.evaluationDate,
            usuarioId: r.userId
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            code: entity.codigo,
            sector: entity.sector,
            hazardType: entity.tipoPeligro,
            description: entity.descripcion,
            probability: entity.probabilidad,
            severity: entity.severidad,
            riskLevel: this.#riskToResource(entity.nivelRiesgo),
            controlMeasures: entity.medidasControl,
            status: this.#statusToResource(entity.estado),
            evaluationDate: entity.fechaEvaluacion,
            userId: entity.usuarioId
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['evaluaciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
