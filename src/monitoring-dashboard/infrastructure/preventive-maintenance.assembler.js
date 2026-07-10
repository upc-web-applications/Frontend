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
      status: resource.status,
      createdAt: resource.createdAt
    })
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
