import { Inspeccion } from '@/inspeccion/domain/model/inspeccion-entity.js'
export class InspeccionAssembler {
    static toEntityFromResource(r) { return new Inspeccion({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['inspecciones']
        return data.map(r => this.toEntityFromResource(r))
    }
}
