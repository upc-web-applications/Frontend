import { NivelCriticidadArea } from '@/risk-assessment/domain/model/nivel-criticidad-area.entity.js'
export class NivelCriticidadAreaAssembler {
    static #levelFromResource(l) { return { Low: 'Tolerable', Medium: 'Moderado', High: 'Importante', Critical: 'Critico' }[l] ?? l }
    static #levelToResource(l) { return { Tolerable: 'Low', Moderado: 'Medium', Importante: 'High', Critico: 'Critical' }[l] ?? l }
    static #intensityFromResource(i) { return { Low: 'baja', Medium: 'media', High: 'alta', Critical: 'muy_alta' }[i] ?? i }
    static #intensityToResource(i) { return { baja: 'Low', media: 'Medium', alta: 'High', muy_alta: 'Critical' }[i] ?? i }

    static toEntityFromResource(r) {
        return new NivelCriticidadArea({
            id: r.id,
            sectorId: r.sectorId,
            sector: r.sector,
            nivelCriticidad: this.#levelFromResource(r.criticalityLevel),
            intensidadMapa: this.#intensityFromResource(r.mapIntensity),
            ultimaActualizacion: r.lastUpdated
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            sectorId: entity.sectorId,
            sector: entity.sector,
            criticalityLevel: this.#levelToResource(entity.nivelCriticidad),
            mapIntensity: this.#intensityToResource(entity.intensidadMapa),
            lastUpdated: entity.ultimaActualizacion
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['niveles'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
