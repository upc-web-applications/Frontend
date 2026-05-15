import { PreventiveMaintenance } from '@/monitoring-dashboard/domain/model/preventive-maintenance-entity.js'

export class PreventiveMaintenanceAssembler {
  static toEntityFromResource(resource) {
    return new PreventiveMaintenance({ ...resource })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    const resources = response.data instanceof Array ? response.data : response.data['preventiveMaintenances']
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
