import { NotificacionCritica } from '@/mitigation/domain/model/notificacion-critica.entity.js'
export class NotificacionCriticaAssembler {
    static toEntityFromResource(r) {
        return new NotificacionCritica({
            id: r.id,
            ticketId: r.ticketId,
            supervisorId: r.supervisorId,
            supervisorNombre: r.supervisorName,
            mensaje: r.message,
            enviada: r.sent,
            fechaEnvio: r.sentDate
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            ticketId: entity.ticketId,
            supervisorId: entity.supervisorId,
            supervisorName: entity.supervisorNombre,
            message: entity.mensaje,
            sent: entity.enviada,
            sentDate: entity.fechaEnvio
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['notificaciones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
