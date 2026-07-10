import { Hazard } from '@/risk-assessment/hazard/domain/model/hazard.entity.js'
/**
 * @author u202418655  Victor Jhosef Laura Acosta
 */
export class HazardAssembler {
    static toEntityFromResource(r) { return new Hazard({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['peligros']
        return data.map(r => this.toEntityFromResource(r))
    }
}
