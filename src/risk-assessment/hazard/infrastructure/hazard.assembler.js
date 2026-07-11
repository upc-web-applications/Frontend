import { Hazard } from '@/risk-assessment/hazard/domain/model/hazard.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class HazardAssembler {
    static #statusFromResource(status) { return { Active: 'Activo', Inactive: 'Inactivo' }[status] ?? status }
    static #statusToResource(status) { return { Activo: 'Active', Inactivo: 'Inactive' }[status] ?? status }
    static #riskFromResource(level) { return { Low: 'Bajo', Medium: 'Medio', High: 'Alto', Critical: 'Critico' }[level] ?? level }
    static #riskToResource(level) { return { Bajo: 'Low', Medio: 'Medium', Alto: 'High', Critico: 'Critical' }[level] ?? level }

    static toEntityFromResource(r) {
        return new Hazard({
            id: r.id,
            codigo: r.code,
            nombre: r.name,
            tipo: r.category,
            descripcion: r.description,
            nivelRiesgoBase: this.#riskFromResource(r.baseRiskLevel),
            estado: this.#statusFromResource(r.status)
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            code: entity.codigo,
            name: entity.nombre,
            category: entity.tipo,
            description: entity.descripcion,
            baseRiskLevel: this.#riskToResource(entity.nivelRiesgoBase),
            status: this.#statusToResource(entity.estado)
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['peligros'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
