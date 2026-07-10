import { Session } from '@/identity-access/domain/model/session-entity.js'

export class SessionAssembler {
  static toEntityFromResource(resource) {
    return new Session({ ...resource })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['sessions'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
