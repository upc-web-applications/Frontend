import { Ticket } from '@/monitoring-dashboard/domain/model/ticket-entity.js'

export class TicketAssembler {
  static #statusFromResource(status) {
    return { Pending: 'Pendiente', Open: 'Pendiente', InProgress: 'En ejecucion', Scheduled: 'Asignado', Resolved: 'Cerrado', Closed: 'Cerrado' }[status] ?? status
  }

  static #riskFromResource(priority) {
    return { Low: 'Bajo', Medium: 'Medio', High: 'Alto', Critical: 'Critico' }[priority] ?? priority
  }

  static toEntityFromResource(resource) {
    return new Ticket({
      id: resource.id,
      code: resource.code || `TKT-${resource.id}`,
      heatMapId: resource.heatMapId || resource.sectorId,
      sector: resource.sector || resource.sectorId,
      riskLevel: this.#riskFromResource(resource.priority),
      assignedTechnician: resource.assignedTechnicianId,
      assetName: resource.assetName,
      requiredSpecialty: resource.requiredSpecialty,
      assignmentDetails: resource.assignmentDetails,
      status: this.#statusFromResource(resource.status),
      elapsedTime: resource.elapsedTime,
      slaStatus: resource.slaStatus,
      description: resource.description || resource.title,
      generatedAt: resource.generatedAt || resource.createdAt
    })
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      sectorId: entity.heatMapId,
      title: entity.description || entity.code,
      status: { Pendiente: 'Pending', 'En ejecucion': 'InProgress', Asignado: 'Scheduled', Cerrado: 'Resolved' }[entity.status] ?? entity.status,
      priority: { Bajo: 'Low', Medio: 'Medium', Alto: 'High', Critico: 'Critical' }[entity.riskLevel] ?? entity.riskLevel,
      assignedTechnicianId: entity.assignedTechnician,
      createdAt: entity.generatedAt
    }
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
