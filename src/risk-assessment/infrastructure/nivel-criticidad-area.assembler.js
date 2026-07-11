import { NivelCriticidadArea } from '@/risk-assessment/domain/model/nivel-criticidad-area.entity.js'
export class NivelCriticidadAreaAssembler {
    static toEntityFromResource(r) {
        return new NivelCriticidadArea({
            id: r.id,
            sectorId: r.sectorId,
            sector: r.sector,
            nivelCriticidad: r.criticalityLevel,
            intensidadMapa: r.mapIntensity,
            ultimaActualizacion: r.lastUpdated
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            sectorId: entity.sectorId,
            sector: entity.sector,
            criticalityLevel: entity.nivelCriticidad,
            mapIntensity: entity.intensidadMapa,
            lastUpdated: entity.ultimaActualizacion
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['niveles'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
