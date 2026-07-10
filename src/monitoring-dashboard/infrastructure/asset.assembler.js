import { Asset } from '@/monitoring-dashboard/domain/model/asset-entity.js'

export class AssetAssembler {
  static toEntityFromResource(resource) {
    return new Asset({ ...resource })
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
