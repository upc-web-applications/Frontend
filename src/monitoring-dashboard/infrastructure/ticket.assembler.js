import { Ticket } from '@/monitoring-dashboard/domain/model/ticket-entity.js'

export class TicketAssembler {
  static toEntityFromResource(resource) {
    return new Ticket({ ...resource })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    const resources = (response.data instanceof Array ? response.data : (response.data ? response.data['tickets'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
