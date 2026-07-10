import { Area } from '@/organization-assets/area/domain/model/area.entity.js'
/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
export class AreaAssembler {
    static toEntityFromResource(r) {
        return new Area({
            id: r.id,
            nombre: r.name,
            codigo: r.code,
            descripcion: r.description,
            sedeId: r.headquartersId,
            estado: r.status,
            nivelRiesgo: r.riskLevel,
            fechaCreacion: r.createdAt
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['areas'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
