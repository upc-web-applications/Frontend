import { TicketAccionCorrectiva } from '@/mitigation/domain/model/ticket-accion-correctiva.entity.js'
export class TicketAccionCorrectivaAssembler {
    static toEntityFromResource(r) { return new TicketAccionCorrectiva({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['tickets']
        return data.map(r => this.toEntityFromResource(r))
    }
}
