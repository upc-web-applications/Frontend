import { Ticket } from '@/monitoring-dashboard/domain/model/ticket-entity.js'

export class TicketAssembler {
  static toEntityFromResource(resource) {
    return new Ticket({
      id: resource.id,
      code: resource.code,
      heatMapId: resource.heatMapId,
      sector: resource.sector,
      incidentType: resource.incidentType,
      riskLevel: resource.riskLevel,
      assignedTechnician: resource.assignedTechnician,
      assetName: resource.assetName,
      requiredSpecialty: resource.requiredSpecialty,
      assignmentDetails: resource.assignmentDetails,
      status: resource.status,
      elapsedTime: resource.elapsedTime,
      slaStatus: resource.slaStatus,
      description: resource.description,
      generatedAt: resource.generatedAt
    })
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
