import { HeatMapZone } from '@/monitoring-dashboard/domain/model/heat-map-zone-entity.js'

export class HeatMapAssembler {
  static toEntityFromResource(resource) {
    return new HeatMapZone({ ...resource })
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
