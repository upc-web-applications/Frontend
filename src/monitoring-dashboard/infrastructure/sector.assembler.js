import { Sector } from '@/monitoring-dashboard/domain/model/sector-entity.js'

export class SectorAssembler {
  static toEntityFromResource(resource) {
    return new Sector({ ...resource })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    const resources = response.data instanceof Array ? response.data : response.data['heatMapZones']
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
