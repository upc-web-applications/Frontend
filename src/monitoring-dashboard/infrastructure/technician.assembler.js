import { Technician } from '@/monitoring-dashboard/domain/model/technician-entity.js'

export class TechnicianAssembler {
  static toEntityFromResource(resource) {
    return new Technician({
      id: resource.id,
      code: resource.code,
      firstName: resource.firstName,
      lastName: resource.lastName,
      fullName: resource.fullName,
      specialty: resource.specialty,
      email: resource.email,
      phone: resource.phone,
      status: resource.status
    })
  }

  static toEntitiesFromResponse(response) {
    if (response.status !== 200) {
      console.error(`${response.status} - ${response.statusText}`)
      return []
    }
    const resources = (response.data instanceof Array ? response.data : (response.data ? response.data['technicians'] : null)) ?? []
    return resources.map(resource => this.toEntityFromResource(resource))
  }
}
