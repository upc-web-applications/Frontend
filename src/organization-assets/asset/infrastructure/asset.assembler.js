import { Asset } from '@/organization-assets/asset/domain/model/asset.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class AssetAssembler {
    static toEntityFromResource(r) {
        return new Asset({
            id: r.id,
            codigo: r.code,
            nombre: r.name,
            descripcion: r.description,
            areaId: r.areaId,
            sedeId: r.headquartersId,
            estado: r.status,
            fechaAdquisicion: r.acquisitionDate,
            ultimoMantenimiento: r.lastMaintenanceDate
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['activos'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
