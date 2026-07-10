import { AlertaPatron } from '@/risk-assessment/domain/model/alerta-patron.entity.js'
export class AlertaPatronAssembler {
    static toEntityFromResource(r) {
        return new AlertaPatron({
            id: r.id,
            patronId: r.patternId,
            sectorId: r.sectorId,
            sector: r.sector,
            tipoRiesgo: r.riskType,
            numeroOcurrencias: r.occurrenceCount,
            fechaPrimerReporte: r.firstReportDate,
            estado: r.status,
            fechaGeneracion: r.generationDate
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['alertas'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
