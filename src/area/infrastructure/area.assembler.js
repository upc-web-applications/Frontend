import { Area } from '@/area/domain/model/area.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class AreaAssembler {
    static #statusFromResource(status) { return { Active: 'Activo', Inactive: 'Inactivo' }[status] ?? status }
    static #statusToResource(status) { return { Activo: 'Active', Inactivo: 'Inactive' }[status] ?? status }

    static toEntityFromResource(r) {
        return new Area({
            id: r.id,
            nombre: r.name,
            codigo: r.code,
            descripcion: r.description,
            sedeId: r.headquartersId,
            estado: this.#statusFromResource(r.status),
            nivelRiesgo: r.riskLevel,
            fechaCreacion: r.createdAt
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            name: entity.nombre,
            code: entity.codigo,
            description: entity.descripcion,
            headquartersId: entity.sedeId,
            status: this.#statusToResource(entity.estado),
            riskLevel: entity.nivelRiesgo
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['areas'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
