import { HistorialTicket } from '@/mitigation/domain/model/historial-ticket.entity.js'
export class HistorialTicketAssembler {
    static toEntityFromResource(r) { return new HistorialTicket({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['historiales'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
