import { Mitigation } from '@/mitigation/domain/model/mitigation.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class MitigationAssembler {
    static #statusFromResource(status) { return { Pending: 'Pendiente', InProgress: 'En ejecucion', Completed: 'Cerrado', Closed: 'Cerrado', MitigationReported: 'Mitigacion reportada', VerificationPending: 'En verificacion', Reopened: 'Reabierto' }[status] ?? status }
    static #statusToResource(status) { return { Pendiente: 'Pending', 'En ejecucion': 'InProgress', 'Mitigacion reportada': 'MitigationReported', 'En verificacion': 'VerificationPending', Cerrado: 'Closed', Reabierto: 'Reopened' }[status] ?? status }

    static toEntityFromResource(r) {
        return new Mitigation({
            id: r.id,
            riskAssessmentId: r.riskAssessmentId,
            ticketId: r.ticketId,
            codigo: r.code,
            descripcion: r.description,
            responsable: r.responsible,
            fechaAsignacion: r.assignedDate,
            fechaEjecucion: r.executionDate,
            estado: this.#statusFromResource(r.status),
            resultado: r.result,
            observaciones: r.observations
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            riskAssessmentId: entity.riskAssessmentId,
            ticketId: entity.ticketId,
            code: entity.codigo,
            description: entity.descripcion,
            responsible: entity.responsable,
            assignedDate: entity.fechaAsignacion,
            executionDate: entity.fechaEjecucion,
            status: this.#statusToResource(entity.estado),
            result: entity.resultado,
            observations: entity.observaciones
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['mitigaciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
