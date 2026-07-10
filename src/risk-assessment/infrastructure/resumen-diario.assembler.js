import { ResumenDiario } from '@/risk-assessment/domain/model/resumen-diario.entity.js'
export class ResumenDiarioAssembler {
    static toEntityFromResource(r) { return new ResumenDiario({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = (response.data instanceof Array ? response.data : (response.data ? response.data['resumenes'] : null)) ?? []
        return data.map(r => this.toEntityFromResource(r))
    }
}
