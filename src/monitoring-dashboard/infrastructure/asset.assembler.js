import { Asset } from '@/monitoring-dashboard/domain/model/asset-entity.js'

export class AssetAssembler {
  static toEntityFromResource(resource) {
    return new Asset({
      id: resource.id,
      name: resource.name,
      code: resource.code,
      brand: resource.brand,
      sector: resource.sector,
      riskLevel: resource.riskLevel,
      lastReview: resource.lastReview,
      status: resource.status
    })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    const resources = (response.data instanceof Array ? response.data : (response.data ? response.data['assets'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
