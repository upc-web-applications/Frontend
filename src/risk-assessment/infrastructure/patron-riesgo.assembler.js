import { PatronRiesgo } from '@/risk-assessment/domain/model/patron-riesgo.entity.js'
export class PatronRiesgoAssembler {
    static toEntityFromResource(r) {
        return new PatronRiesgo({
            id: r.id,
            sectorId: r.sectorId,
            sector: r.sector,
            tipoIncidente: r.incidentType,
            tipoPeligro: r.hazardType,
            descripcion: r.description,
            frecuencia: r.frequency,
            fechaPrimeraOcurrencia: r.firstOccurrenceDate,
            periodoAnalisisDias: r.analysisPeriodDays,
            revisada: r.isReviewed,
            fechaRevision: r.reviewDate,
            revisadoPor: r.reviewedBy
        })
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            sectorId: entity.sectorId,
            sector: entity.sector,
            incidentType: entity.tipoIncidente,
            hazardType: entity.tipoPeligro,
            description: entity.descripcion,
            frequency: entity.frecuencia,
            firstOccurrenceDate: entity.fechaPrimeraOcurrencia,
            analysisPeriodDays: entity.periodoAnalisisDias,
            isReviewed: entity.revisada,
            reviewDate: entity.fechaRevision,
            reviewedBy: entity.revisadoPor
        }
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['patrones'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
