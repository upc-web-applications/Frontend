import { HistorialTicket } from '@/mitigation/domain/model/historial-ticket.entity.js'
export class HistorialTicketAssembler {
    static toEntityFromResource(r) {
        return new HistorialTicket({
            id: r.id,
            ticketId: r.ticketId,
            evento: r.event,
            usuarioId: r.userId,
            usuarioNombre: r.userName,
            detalles: r.details,
            fecha: r.date
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['historiales'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
