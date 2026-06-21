import { PatronRiesgo } from '@/risk-assessment/domain/model/patron-riesgo.entity.js'
export class PatronRiesgoAssembler {
    static toEntityFromResource(r) { return new PatronRiesgo({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['patrones']
        return data.map(r => this.toEntityFromResource(r))
    }
}
