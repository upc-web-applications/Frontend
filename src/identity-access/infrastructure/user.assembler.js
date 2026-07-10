import { User } from '@/identity-access/domain/model/user-entity.js'

export class UserAssembler {
  static toEntityFromResource(resource) {
    return new User({
      id: resource.id,
      roleId: resource.roleId,
      sectorId: resource.sectorId,
      fullName: resource.fullName,
      email: resource.email,
      password: resource.password,
      status: resource.status,
      failedAttempts: resource.failedAttempts,
      blockedUntil: resource.blockedUntil
    })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['users'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
