import { Mitigation } from '@/mitigation/domain/model/mitigation.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class MitigationAssembler {
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
            estado: r.status,
            resultado: r.result,
            observaciones: r.observations
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['mitigaciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
