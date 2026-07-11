import { Technician } from '@/monitoring-dashboard/domain/model/technician-entity.js'

export class TechnicianAssembler {
  static toEntityFromResource(resource) {
    return new Technician({
      id: resource.id,
      code: resource.code,
      firstName: resource.firstName,
      lastName: resource.lastName,
      fullName: resource.fullName || resource.name,
      specialty: resource.specialty,
      email: resource.email,
      phone: resource.phone,
      status: { Active: 'Activo', Inactive: 'Inactivo' }[resource.status] ?? resource.status
    })
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      name: entity.fullName,
      specialty: entity.specialty,
      status: { Activo: 'Active', Inactivo: 'Inactive' }[entity.status] ?? entity.status
    }
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
