import { Area } from '@/area/domain/model/area-entity.js'
export class AreaAssembler {
    static toEntityFromResource(r) { return new Area({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['areas']
        return data.map(r => this.toEntityFromResource(r))
    }
}
