import { Hazard } from '@/risk-assessment/hazard/domain/model/hazard.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class HazardAssembler {
    static toEntityFromResource(r) {
        return new Hazard({
            id: r.id,
            codigo: r.code,
            nombre: r.name,
            tipo: r.category,
            descripcion: r.description,
            nivelRiesgoBase: r.baseRiskLevel,
            estado: r.status
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['peligros'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
