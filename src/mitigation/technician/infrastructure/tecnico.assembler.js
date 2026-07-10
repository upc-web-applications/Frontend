import { Tecnico } from '@/mitigation/technician/domain/model/tecnico.entity.js'
export class TecnicoAssembler {
    static toEntityFromResource(r) { return new Tecnico({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['tecnicos']
        return data.map(r => this.toEntityFromResource(r))
    }
}
