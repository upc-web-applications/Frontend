import { Inspection } from '@/inspection/domain/model/inspection.entity.js'
/**
 * @author u20241a322  Blancas Chávez, Carlos Franco
 */
export class InspectionAssembler {
    static toEntityFromResource(r) { return new Inspection({ ...r }) }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return []
        const data = response.data instanceof Array ? response.data : response.data['inspecciones']
        return data.map(r => this.toEntityFromResource(r))
    }
}
