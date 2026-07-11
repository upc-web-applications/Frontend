import { Site } from '@/site/domain/model/site.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class SiteAssembler {
    static #statusFromResource(status) { return { Active: 'Activo', Inactive: 'Inactivo' }[status] ?? status }
    static #statusToResource(status) { return { Activo: 'Active', Inactivo: 'Inactive' }[status] ?? status }

    static toEntityFromResource(r) {
        return new Site({
            id: r.id,
            nombre: r.name,
            direccion: r.address,
            telefono: r.phone,
            email: r.email,
            estado: this.#statusFromResource(r.status),
            fechaCreacion: r.createdAt
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            name: entity.nombre,
            address: entity.direccion,
            phone: entity.telefono,
            email: entity.email,
            status: this.#statusToResource(entity.estado)
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['sedes'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
