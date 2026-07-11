import { HeatMapZone } from '@/monitoring-dashboard/domain/model/heat-map-zone-entity.js'

export class HeatMapAssembler {
  static #statusToResource(status) { return { Activo: 'Active', Inactivo: 'Inactive' }[status] ?? status }

  static toEntityFromResource(resource) {
    return new HeatMapZone({
      id: resource.id,
      type: resource.type || 'Sector',
      sectorId: resource.sectorId,
      assetId: resource.assetId,
      code: resource.code || resource.id,
      name: resource.name,
      description: resource.description || '',
      heatIndex: resource.heatIndex,
      riskLevel: resource.riskLevel,
      status: resource.status,
      updatedAt: resource.updatedAt || resource.lastUpdate,
      position: resource.position
    })
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      name: entity.name,
      sectorId: entity.sectorId,
      heatIndex: entity.heatIndex,
      riskLevel: entity.riskLevel,
      lastUpdate: entity.updatedAt
    }
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
