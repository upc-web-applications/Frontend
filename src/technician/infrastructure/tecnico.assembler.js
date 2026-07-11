import { Tecnico } from '@/technician/domain/model/tecnico.entity.js'
export class TecnicoAssembler {
    static #statusFromResource(status) { return { Active: 'Activo', Inactive: 'Inactivo' }[status] ?? status }
    static #statusToResource(status) { return { Activo: 'Active', Inactivo: 'Inactive' }[status] ?? status }

    static toEntityFromResource(r) {
        return new Tecnico({
            id: r.id,
            numeroDocumento: r.documentNumber,
            nombreCompleto: r.fullName,
            especialidad: r.specialty,
            telefono: r.phone,
            email: r.email,
            estado: this.#statusFromResource(r.status)
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            documentNumber: entity.numeroDocumento,
            fullName: entity.nombreCompleto,
            specialty: entity.especialidad,
            phone: entity.telefono,
            email: entity.email,
            status: this.#statusToResource(entity.estado)
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['tecnicos'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
