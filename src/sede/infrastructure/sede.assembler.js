import { Sede } from '@/sede/domain/model/sede-entity.js'
export class SedeAssembler {
    static toEntityFromResource(r) { return new Sede({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['sedes']
        return data.map(r => this.toEntityFromResource(r))
    }
}
