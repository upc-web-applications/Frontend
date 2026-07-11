import { AlertaSLA } from '@/mitigation/domain/model/alerta-sla.entity.js'
export class AlertaSLAAssembler {
    static toEntityFromResource(r) {
        return new AlertaSLA({
            id: r.id,
            ticketId: r.ticketId,
            horasTranscurridas: r.elapsedHours,
            slaLimiteHoras: r.slaLimitHours,
            fechaAlerta: r.alertDate,
            notificadoA: r.notifiedTo,
            notificadoNombre: r.notifiedName
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            ticketId: entity.ticketId,
            elapsedHours: entity.horasTranscurridas,
            slaLimitHours: entity.slaLimiteHoras,
            alertDate: entity.fechaAlerta,
            notifiedTo: entity.notificadoA,
            notifiedName: entity.notificadoNombre
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['alertas'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
