import { Asset } from '@/organization-assets/asset/domain/model/asset.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class AssetAssembler {
    static #statusFromResource(status) { return { Active: 'Activo', Inactive: 'Inactivo' }[status] ?? status }
    static #statusToResource(status) { return { Activo: 'Active', Inactivo: 'Inactive' }[status] ?? status }

    static toEntityFromResource(r) {
        return new Asset({
            id: r.id,
            codigo: r.code,
            nombre: r.name,
            tipo: r.type,
            descripcion: r.description,
            areaId: r.areaId,
            sedeId: r.headquartersId,
            estado: this.#statusFromResource(r.status),
            fechaAdquisicion: r.acquisitionDate,
            ultimoMantenimiento: r.lastMaintenanceDate
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            code: entity.codigo,
            name: entity.nombre,
            type: entity.tipo,
            description: entity.descripcion,
            areaId: entity.areaId,
            headquartersId: entity.sedeId,
            status: this.#statusToResource(entity.estado),
            acquisitionDate: entity.fechaAdquisicion,
            lastMaintenanceDate: entity.ultimoMantenimiento
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['activos'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
