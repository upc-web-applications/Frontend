import { Sector } from '@/monitoring-dashboard/domain/model/sector-entity.js'

export class SectorAssembler {
  static toEntityFromResource(resource) {
    return new Sector({
      id: resource.id,
      type: resource.type,
      sectorId: resource.sectorId,
      assetId: resource.assetId,
      code: resource.code,
      name: resource.name,
      description: resource.description,
      heatIndex: resource.heatIndex,
      riskLevel: resource.riskLevel,
      status: resource.status,
      updatedAt: resource.updatedAt,
      position: resource.position
    })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    const resources = (response.data instanceof Array ? response.data : (response.data ? response.data['heatMapZones'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
