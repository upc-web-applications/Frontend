import { ResumenDiario } from '@/risk-assessment/domain/model/resumen-diario.entity.js'
export class ResumenDiarioAssembler {
    static toEntityFromResource(r) {
        return new ResumenDiario({
            id: r.id,
            fecha: r.date,
            sectorId: r.sectorId,
            sector: r.sector,
            totalNuevos: r.totalNew,
            totalEnProgreso: r.totalInProgress,
            totalResueltos: r.totalResolved
        })
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['resumenes'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
