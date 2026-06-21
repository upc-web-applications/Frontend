import { Mitigation } from '@/mitigation/domain/model/mitigation.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class MitigationAssembler {
    static toEntityFromResource(r) { return new Mitigation({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['mitigaciones']
        return data.map(r => this.toEntityFromResource(r))
    }
}
