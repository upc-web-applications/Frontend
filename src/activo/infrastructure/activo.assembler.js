import { Activo } from '@/activo/domain/model/activo-entity.js'
export class ActivoAssembler {
    static toEntityFromResource(r) { return new Activo({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['activos']
        return data.map(r => this.toEntityFromResource(r))
    }
}
