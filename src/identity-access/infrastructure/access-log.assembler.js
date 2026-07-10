import { AccessLog } from '@/identity-access/domain/model/access-log-entity.js'

export class AccessLogAssembler {
  static toEntityFromResource(resource) {
    return new AccessLog({
      id: resource.id,
      userId: resource.userId,
      email: resource.email,
      attemptAt: resource.attemptAt,
      wasSuccessful: resource.wasSuccessful,
      ipAddress: resource.ipAddress,
      failureReason: resource.failureReason
    })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    let resources = (response.data instanceof Array ? response.data : (response.data ? response.data['accessLogs'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
