import { PreventiveMaintenance } from '@/monitoring-dashboard/domain/model/preventive-maintenance-entity.js'

export class PreventiveMaintenanceAssembler {
  static toEntityFromResource(resource) {
    return new PreventiveMaintenance({
      id: resource.id,
      assetId: resource.assetId,
      assetName: resource.assetName,
      technician: resource.technician || resource.assignedTechnician,
      scheduledDate: resource.scheduledDate,
      reactivationDate: resource.reactivationDate,
      description: resource.description,
      status: { Scheduled: 'Programado', InProgress: 'En mantenimiento', Completed: 'Finalizado' }[resource.status] ?? resource.status,
      createdAt: resource.createdAt
    })
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      assetId: entity.assetId,
      description: entity.description,
      status: { Programado: 'Scheduled', 'En mantenimiento': 'InProgress', Finalizado: 'Completed' }[entity.status] ?? entity.status,
      scheduledDate: entity.scheduledDate
    }
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    const resources = (response.data instanceof Array ? response.data : (response.data ? response.data['preventiveMaintenances'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
